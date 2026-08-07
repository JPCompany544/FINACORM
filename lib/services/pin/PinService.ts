import crypto from "crypto";

export interface ServiceResponse<T = any> {
  success: boolean;
  error?: string;
  data?: T;
}

export const PinService = {
  /**
   * Validate that the PIN meets the strength requirements:
   * - Exactly 4 digits
   * - Numeric only
   */
  validateStrength(pin: string): boolean {
    return /^\d{4}$/.test(pin);
  },

  /**
   * Generates a secure HMAC hash for a 4-digit PIN using a hex salt.
   * This is mathematically identical to: encode(hmac(pin::bytea, salt::bytea, 'sha256'), 'hex')
   */
  hash(pin: string, salt: string): string {
    if (!this.validateStrength(pin)) {
      throw new Error("Invalid PIN format. PIN must be exactly 4 numeric digits.");
    }
    return crypto
      .createHmac("sha256", salt)
      .update(pin)
      .digest("hex");
  },

  /**
   * Verifies if a plain text PIN matches the stored hash and salt.
   */
  verify(pin: string, salt: string, storedHash: string): boolean {
    if (!this.validateStrength(pin)) {
      return false;
    }
    try {
      const calculatedHash = this.hash(pin, salt);
      return crypto.timingSafeEqual(
        Buffer.from(calculatedHash, "hex"),
        Buffer.from(storedHash, "hex")
      );
    } catch {
      return false;
    }
  },

  /**
   * Placeholder/Architecture for future administrator PIN resets.
   * Administrators must NEVER view customer PINs or retrieve hashed PINs.
   * A reset will simply clear the existing PIN or generate a secure temporary reset token.
   */
  async reset(userId: string): Promise<ServiceResponse> {
    if (!userId) {
      return { success: false, error: "User ID is required." };
    }
    // In the future, this will initiate a reset flow (e.g. email reset token or set temp PIN)
    // For now, it is prepared in the service architecture.
    return { success: true, error: "Not implemented. Contact support." };
  }
};
