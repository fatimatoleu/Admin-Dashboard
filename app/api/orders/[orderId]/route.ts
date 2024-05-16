import Customer from "@/lib/models/Customer";
// Импортируем модель Customer из указанного пути.

import Order from "@/lib/models/Order";
// Импортируем модель Order из указанного пути.

import Product from "@/lib/models/Product";
// Импортируем модель Product из указанного пути.

import { connectToDB } from "@/lib/mongoDB";
// Импортируем функцию для подключения к базе данных из указанного пути.

import { NextRequest, NextResponse } from "next/server";
// Импортируем NextRequest и NextResponse из библиотеки Next.js для обработки серверных запросов и ответов.

export const GET = async (req: NextRequest, { params }: { params: { orderId: String }}) => {
  // Определяем асинхронную функцию для обработки GET-запросов.
  try {
    await connectToDB();
    // Подключаемся к базе данных.

    const orderDetails = await Order.findById(params.orderId).populate({
      path: "products.product",
      model: Product
    });
    // Находим заказ по ID и заполняем поле products данными из модели Product.

    if (!orderDetails) {
      return new NextResponse(JSON.stringify({ message: "Order Not Found" }), { status: 404 });
      // Возвращаем ошибку 404, если заказ не найден.
    }

    const customer = await Customer.findOne({ clerkId: orderDetails.customerClerkId });
    // Находим клиента по его clerkId из данных заказа.

    return NextResponse.json({ orderDetails, customer }, { status: 200 });
    // Возвращаем найденные данные о заказе и клиенте с статусом 200.
  } catch (err) {
    console.log("[orderId_GET]", err);
    // Логируем ошибку при выполнении запроса.

    return new NextResponse("Internal Server Error", { status: 500 });
    // Возвращаем ошибку 500 в случае возникновения исключения.
  }
};

export const dynamic = "force-dynamic";
// Экспортируем переменную dynamic с значением "force-dynamic", чтобы указать, что страница должна быть динамически рендерена на сервере.
