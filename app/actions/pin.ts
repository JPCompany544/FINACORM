"use server";

import { createClient } from "@/lib/supabase/server";
import { PinService } from "@/lib/services/pin/PinService";

export interface PinActionResult {
  success: boolean;
  error?: string;
  lockout?: boolean;
  noPin?: boolean;
}

/**
 * Check whether the currently authenticated user has a Transaction PIN configured.
 */
export async function checkHasPinAction(): Promise<boolean> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.rpc("check_user_has_pin");
    if (error) return false;
    return !!data;
  } catch {
    return false;
  }
}

/**
 * Verify the currently authenticated user's Transaction PIN.
 * All comparison is done on the database server — the hash never reaches the client.
 */
export async function verifyPinAction(pin: string): Promise<PinActionResult> {
  // Validate format before sending to database
  if (!PinService.validateStrength(pin)) {
    return { success: false, error: "PIN must be exactly 4 numeric digits." };
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase.rpc("verify_transaction_pin", {
      p_pin: pin,
    });

    if (error) {
      return { success: false, error: "Verification failed. Please try again." };
    }

    const result = data as { success: boolean; error?: string; lockout?: boolean; noPin?: boolean };
    return {
      success: result.success,
      error: result.error,
      lockout: result.lockout,
      noPin: result.noPin,
    };
  } catch {
    return { success: false, error: "An unexpected error occurred. Please try again." };
  }
}

/**
 * Set up a Transaction PIN for the first time, or for users who don't have one.
 */
export async function setupPinAction(pin: string, confirmPin: string): Promise<PinActionResult> {
  // Validate format
  if (!PinService.validateStrength(pin)) {
    return { success: false, error: "PIN must be exactly 4 numeric digits." };
  }
  if (pin !== confirmPin) {
    return { success: false, error: "PINs do not match. Please try again." };
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase.rpc("set_transaction_pin", {
      p_pin: pin,
    });

    if (error) {
      return { success: false, error: "Failed to set Transaction PIN. Please try again." };
    }

    const result = data as { success: boolean; error?: string };
    return { success: result.success, error: result.error };
  } catch {
    return { success: false, error: "An unexpected error occurred. Please try again." };
  }
}

/**
 * Change the currently authenticated user's Transaction PIN.
 * Requires the current PIN to be verified before the new one is set.
 */
export async function changePinAction(
  currentPin: string,
  newPin: string,
  confirmPin: string
): Promise<PinActionResult> {
  // Validate formats
  if (!PinService.validateStrength(currentPin)) {
    return { success: false, error: "Current PIN must be exactly 4 numeric digits." };
  }
  if (!PinService.validateStrength(newPin)) {
    return { success: false, error: "New PIN must be exactly 4 numeric digits." };
  }
  if (newPin !== confirmPin) {
    return { success: false, error: "New PINs do not match. Please try again." };
  }
  if (currentPin === newPin) {
    return { success: false, error: "New PIN must be different from your current PIN." };
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase.rpc("change_transaction_pin", {
      p_current_pin: currentPin,
      p_new_pin: newPin,
    });

    if (error) {
      return { success: false, error: "Failed to change Transaction PIN. Please try again." };
    }

    const result = data as { success: boolean; error?: string; lockout?: boolean };
    return {
      success: result.success,
      error: result.error,
      lockout: result.lockout,
    };
  } catch {
    return { success: false, error: "An unexpected error occurred. Please try again." };
  }
}
