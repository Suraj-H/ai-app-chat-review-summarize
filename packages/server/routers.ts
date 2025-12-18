import type { Request, Response } from "express";
import express from "express";
import { chatController } from "./controllers/chat.controller";

import { PrismaClient } from "./generated/prisma";


const router = express.Router()

router.get('/', (req: Request, res: Response) => {
res.send('Hello World!')
})

router.post('/api/chat', chatController.sendMessage)

router.get('/api/products/:id/reviews', async(req: Request, res: Response) => {
  const prisma = new PrismaClient()
  const productId = Number(req.params.id)

  if(isNaN(productId)) {
    res.status(400).json({error: 'Invalid product ID.'})
  }

  const response = await prisma.review.findMany({
    where:{productId},
    orderBy: {createdAt:'desc' }
  })

  res.json(response)
})

export default router
