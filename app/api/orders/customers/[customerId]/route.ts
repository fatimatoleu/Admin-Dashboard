import Order from "@/lib/models/Order";
// Импортируем модель Order из указанного пути.

import Product from "@/lib/models/Product";
// Импортируем модель Product из указанного пути.

import { connectToDB } from "@/lib/mongoDB";
// Импортируем функцию для подключения к базе данных из указанного пути.

import { NextRequest, NextResponse } from "next/server";
// Импортируем NextRequest и NextResponse из библиотеки Next.js для обработки серверных запросов и ответов.

export const GET = async (
  req: NextRequest,
  { params }: { params: { customerId: string } }
) => {
  // Определяем асинхронную функцию для обработки GET-запросов.
  try {
    await connectToDB();
    // Подключаемся к базе данных.

    const orders = await Order.find({
      customerClerkId: params.customerId,
    }).populate({ path: "products.product", model: Product });
    // Находим все заказы по customerClerkId и заполняем поле products данными из модели Product.

    return NextResponse.json(orders, { status: 200 });
    // Возвращаем найденные заказы с статусом 200.
  } catch (err) {
    console.log("[customerId_GET]", err);
    // Логируем ошибку при выполнении запроса.

    return new NextResponse("Internal Server Error", { status: 500 });
    // Возвращаем ошибку 500 в случае возникновения исключения.
  }
};

export const dynamic = "force-dynamic";
// Экспортируем переменную dynamic с значением "force-dynamic", чтобы указать, что страница должна быть динамически рендерена на сервере.
