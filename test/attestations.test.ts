import { ethers } from "hardhat";
import { assert } from "chai";
import { BytesLike } from "ethers";
import { submit } from "./support";
import { AttestationRegistry__factory } from "../contract-bindings/ethers";

// prettier-ignore
type Signature = [
  BytesLike, BytesLike, BytesLike, BytesLike, BytesLike, BytesLike, BytesLike, BytesLike,
  BytesLike, BytesLike, BytesLike, BytesLike, BytesLike, BytesLike, BytesLike, BytesLike,
  BytesLike, BytesLike, BytesLike, BytesLike, BytesLike, BytesLike, BytesLike, BytesLike,
  BytesLike, BytesLike, BytesLike, BytesLike, BytesLike, BytesLike, BytesLike, BytesLike,
  BytesLike, BytesLike, BytesLike, BytesLike, BytesLike, BytesLike, BytesLike, BytesLike,
  BytesLike, BytesLike, BytesLike, BytesLike, BytesLike, BytesLike, BytesLike, BytesLike,
  BytesLike, BytesLike, BytesLike, BytesLike, BytesLike, BytesLike, BytesLike, BytesLike,
  BytesLike, BytesLike, BytesLike, BytesLike, BytesLike, BytesLike, BytesLike, BytesLike,
];

describe("Attestations", function () {
  it("should allow attestations to be made and revoked", async function () {
    const [signer] = await ethers.getSigners();
    const address = await signer.getAddress();
    const attestationRegistry = await new AttestationRegistry__factory(signer).deploy();
    await attestationRegistry.deployed();

    const id = ethers.utils.randomBytes(32);
    const rev = ethers.utils.randomBytes(32);
    const pk = ethers.utils.randomBytes(32);
    const sig = new Array(64).fill([0]) as Signature;

    await submit(attestationRegistry.attest(id, rev, pk, sig));

    const attestation = await attestationRegistry.attestations(address);
    assert.equal(attestation.id, ethers.utils.hexlify(id));

    await submit(attestationRegistry.revokeAttestation());
    const revoked = await attestationRegistry.attestations(address);
    assert.equal(
      ethers.utils.hexlify(revoked.id),
      "0x0000000000000000000000000000000000000000000000000000000000000000"
    );
  });
});
