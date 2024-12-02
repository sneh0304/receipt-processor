import express, {Express, Request, Response} from 'express';
import { v4 as uuidv4 } from "uuid";
import { IReceipt } from './interfaces/interfaces.js';

const port = process.env.PORT || 8000;

const app: Express = express();

// Middlewares
app.use(express.json());

const receiptsToPointsMap: Map<string, number> = new Map();

// Helper function to calculate points
function calculatePoints(receipt: IReceipt): number {
  let points = 0;

  // Rule 1: One point for every alphanumeric character in the retailer name
  points += (receipt.retailer.match(/[a-zA-Z0-9]/g) || []).length;

  // Rule 2: 50 points if the total is a round dollar amount with no cents
  const total = parseFloat(receipt.total);
  if (Number.isInteger(total)) {
    points += 50;
  }

  // Rule 3: 25 points if the total is a multiple of 0.25
  if (total % 0.25 === 0) {
    points += 25;
  }

  // Rule 4: 5 points for every two items on the receipt
  points += Math.floor(receipt.items.length / 2) * 5;

  // Rule 5: Points based on item description length
  receipt.items.forEach((item) => {
    const description = item.shortDescription.trim();
    const price = parseFloat(item.price);
    if (description.length % 3 === 0) {
      points += Math.ceil(price * 0.2);
    }
  });

  // Rule 6: 6 points if the day in the purchase date is odd
  const day = new Date(receipt.purchaseDate).getUTCDate();
  if (day % 2 !== 0) {
    points += 6;
  }

  // Rule 7: 10 points if the time of purchase is between 2:00pm and 4:00pm
  const [hours, minutes] = receipt.purchaseTime.split(":").map(Number);
  if (hours === 14 || (hours === 15 && minutes < 60)) {
    points += 10;
  }

  return points;
}

// Rest apis
// POST /receipts/process
app.post("/receipts/process", (req: Request, res: Response) => {
  try {
    const receipt: IReceipt = req.body;
    const receiptId = uuidv4();
    const points = calculatePoints(receipt);

    receiptsToPointsMap.set(receiptId, points);
    res.status(200).json({ id: receiptId });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: "Invalid receipt data" });
  }
});

// GET /receipts/:id/points
app.get("/receipts/:id/points", (req: Request, res: Response) => {
  const receiptId = req.params.id;
  if (receiptsToPointsMap.has(receiptId)) {
    res.status(200).json({ points: receiptsToPointsMap.get(receiptId) });
  } else {
    res.status(404).json({ error: "Receipt ID not found" });
  }
});


app.listen(port, () => {console.log(`Server Started at port ${port}!!!`)});