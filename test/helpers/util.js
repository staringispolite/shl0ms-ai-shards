const {
  BN,           // Big Number support
  constants,    // Common constants, like the zero address and largest integers
  expectEvent,  // Assertions for emitted events
  expectRevert, // Assertions for transactions that should fail
  time,
} = require('@openzeppelin/test-helpers');

async function shouldThrow(promise) {
  try {
    await promise;
    assert(true);
  }
  catch (err) {
    return;
  }
  assert(false, "The contract did not throw.");
}

advanceTimeAndBlock = async (duration) => {
  await time.increase(duration);
  await time.advanceBlock();
}

module.exports = {
	advanceTimeAndBlock,
  shouldThrow,
};

