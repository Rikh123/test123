const mongoose = require('mongoose');
const Recharge = require('../models/Recharge');
require('dotenv').config();

async function migrateDiamondField() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const recharges = await Recharge.find();

    for (const recharge of recharges) {
      if (!recharge.diamond || recharge.diamond === 0) {
        let diamond = 0;
        if (recharge.pack) {
          const diamondMatch = recharge.pack.match(/(\d+)\s*Diamonds/);
          if (diamondMatch) {
            diamond = parseInt(diamondMatch[1], 10);
          }
        }
        recharge.diamond = diamond;
        await recharge.save();
        console.log(`Updated recharge ${recharge._id} with diamond count: ${diamond}`);
      }
    }

    console.log('Diamond field migration completed.');
    process.exit(0);
  } catch (err) {
    console.error('Error during diamond field migration:', err);
    process.exit(1);
  }
}

migrateDiamondField();
