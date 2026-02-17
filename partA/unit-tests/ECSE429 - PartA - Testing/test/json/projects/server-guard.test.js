const { expect } = require("chai");
const { isServerRunning, startServer, shutdownServer } = require("../../helpers");

describe("JSON – Server availability guard", function () {
  // This test runs WITHOUT starting the server first.
  // It validates the requirement: "Ensure unit tests fail if service is not running."
  it("should detect that the service is unreachable before startup", async function () {
    // Make sure no server is lingering from a prior run
    try { await shutdownServer(); } catch (_) {}

    const running = await isServerRunning();
    expect(running).to.equal(false);
  });

  it("should detect the service after startup", async function () {
    await startServer();
    const running = await isServerRunning();
    expect(running).to.equal(true);
    await shutdownServer();
  });
});
