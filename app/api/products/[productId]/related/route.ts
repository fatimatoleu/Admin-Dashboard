import Product from "@/lib/models/Product";
// Импортируем модель Product из указанного пути.

import { connectToDB } from "@/lib/mongoDB";
// Импортируем функцию для подключения к базе данных из указанного пути.

import { NextRequest, NextResponse } from "next/server";
// Импортируем NextRequest и NextResponse из библиотеки Next.js для обработки серверных запросов и ответов.

export const GET = async (req: NextRequest, { params }: { params: { productId: string } }) => {
  // Определяем асинхронную функцию для обработки GET-запросов.
  try {
    await connectToDB();
    // Подключаемся к базе данных.

    const product = await Product.findById(params.productId);
    // Находим продукт по ID.

    if (!product) {
      return new NextResponse(JSON.stringify({ message: "Product not found" }), { status: 404 });
      // Возвращаем ошибку 404, если продукт не найден.
    }

    const relatedProducts = await Product.find({
      $or: [
        { category: product.category },
        { collections: { $in: product.collections }}
      ],
      _id: { $ne: product._id } // Исключаем текущий продукт
    });
    // Находим связанные продукты по категории или коллекциям, исключая текущий продукт.

    if (!relatedProducts.length) {
      return new NextResponse(JSON.stringify({ message: "No related products found" }), { status: 404 });
      // Возвращаем ошибку 404, если связанные продукты не найдены.
    }

    return NextResponse.json(relatedProducts, { status: 200 });
    // Возвращаем найденные связанные продукты с статусом 200.
  } catch (err) {
    console.log("[related_GET]", err);
    // Логируем ошибку при выполнении запроса.

    return new NextResponse("Internal Server Error", { status: 500 });
    // Возвращаем ошибку 500 в случае возникновения исключения.
  }
};

export const dynamic = "force-dynamic";
// Экспортируем переменную dynamic с значением "force-dynamic", чтобы указать, что страница должна быть динамически рендерена на сервере.
