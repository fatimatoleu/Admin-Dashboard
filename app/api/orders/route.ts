import Customer from "@/lib/models/Customer";
// Импортируем модель Customer из указанного пути.

import Order from "@/lib/models/Order";
// Импортируем модель Order из указанного пути.

import { connectToDB } from "@/lib/mongoDB";
// Импортируем функцию для подключения к базе данных из указанного пути.

import { NextRequest, NextResponse } from "next/server";
// Импортируем NextRequest и NextResponse из библиотеки Next.js для обработки серверных запросов и ответов.

import { format } from "date-fns";
// Импортируем функцию format из библиотеки date-fns для форматирования дат.

export const GET = async (req: NextRequest) => {
  // Определяем асинхронную функцию для обработки GET-запросов.
  try {
    await connectToDB();
    // Подключаемся к базе данных.

    const orders = await Order.find().sort({ createdAt: "desc" });
    // Находим все заказы, отсортированные по дате создания в порядке убывания.

    const orderDetails = await Promise.all(orders.map(async (order) => {
      // Используем Promise.all для параллельной обработки всех заказов.
      const customer = await Customer.findOne({ clerkId: order.customerClerkId });
      // Находим клиента по его clerkId из данных заказа.

      return {
        _id: order._id,
        customer: customer ? customer.name : "Unknown",
        // Возвращаем имя клиента, если клиент найден, иначе "Unknown".

        products: order.products.length,
        // Возвращаем количество продуктов в заказе.

        totalAmount: order.totalAmount,
        // Возвращаем общую сумму заказа.

        createdAt: format(order.createdAt, "MMM do, yyyy")
        // Форматируем дату создания заказа в читаемый формат.
      };
    }));

    return NextResponse.json(orderDetails, { status: 200 });
    // Возвращаем обработанные данные заказов с статусом 200.
  } catch (err) {
    console.log("[orders_GET]", err);
    // Логируем ошибку при выполнении запроса.

    return new NextResponse("Internal Server Error", { status: 500 });
    // Возвращаем ошибку 500 в случае возникновения исключения.
  }
};

export const dynamic = "force-dynamic";
// Экспортируем переменную dynamic с значением "force-dynamic", чтобы указать, что страница должна быть динамически рендерена на сервере.
