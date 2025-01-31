import { bytesToHex } from "@noble/ciphers/utils";
import { Buffer } from "buffer";
import { ECIES_CONFIG, PublicKey, decrypt, encrypt } from "eciesjs";

globalThis.Buffer = Buffer; // polyfill manually

ECIES_CONFIG.is_ephemeral_key_compressed = false

const encoder = new TextEncoder();

export function setup(pkContainer, contentContainer, encodingTriggerElement, resultContainer) {
  const handleEciesForm = () => {
    let publicKey = PublicKey.fromHex(pkContainer.value);
    let encrypted = encrypt(publicKey.toHex(), encoder.encode(contentContainer.value));
    resultContainer.value = bytesToHex(encrypted);
  };

  encodingTriggerElement.addEventListener("submit", () => handleEciesForm());
}