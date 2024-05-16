import Collection from "@/lib/models/Collection";
// Импортируем модель Collection из указанного пути.

import Product from "@/lib/models/Product";
// Импортируем модель Product из указанного пути.

import { connectToDB } from "@/lib/mongoDB";
// Импортируем функцию для подключения к базе данных из указанного пути.

import { auth } from "@clerk/nextjs";
// Импортируем функцию аутентификации из библиотеки @clerk/nextjs.

import { NextRequest, NextResponse } from "next/server";
// Импортируем NextRequest и NextResponse из библиотеки Next.js для обработки серверных запросов и ответов.

export const GET = async (
  req: NextRequest,
  { params }: { params: { productId: string } }
) => {
  // Определяем асинхронную функцию для обработки GET-запросов.
  try {
    await connectToDB();
    // Подключаемся к базе данных.

    const product = await Product.findById(params.productId).populate({
      path: "collections",
      model: Collection,
    });
    // Находим продукт по ID и заполняем поле collections данными из модели Collection.

    if (!product) {
      return new NextResponse(
        JSON.stringify({ message: "Product not found" }),
        { status: 404 }
      );
      // Возвращаем ошибку 404, если продукт не найден.
    }

    return new NextResponse(JSON.stringify(product), {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": `${process.env.ECOMMERCE_STORE_URL}`,
        "Access-Control-Allow-Methods": "GET",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
    // Возвращаем найденный продукт с статусом 200 и заголовками CORS.
  } catch (err) {
    console.log("[productId_GET]", err);
    // Логируем ошибку при выполнении запроса.

    return new NextResponse("Internal error", { status: 500 });
    // Возвращаем ошибку 500 в случае возникновения исключения.
  }
};

export const POST = async (
  req: NextRequest,
  { params }: { params: { productId: string } }
) => {
  // Определяем асинхронную функцию для обработки POST-запросов.
  try {
    const { userId } = auth();
    // Получаем ID пользователя из контекста аутентификации.

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
      // Возвращаем ошибку 401, если пользователь не аутентифицирован.
    }

    await connectToDB();
    // Подключаемся к базе данных.

    const product = await Product.findById(params.productId);
    // Находим продукт по ID.

    if (!product) {
      return new NextResponse(
        JSON.stringify({ message: "Product not found" }),
        { status: 404 }
      );
      // Возвращаем ошибку 404, если продукт не найден.
    }

    const {
      title,
      description,
      media,
      category,
      collections,
      tags,
      sizes,
      colors,
      price,
      expense,
    } = await req.json();
    // Получаем данные из тела запроса.

    if (!title || !description || !media || !category || !price || !expense) {
      return new NextResponse("Not enough data to create a new product", {
        status: 400,
      });
      // Возвращаем ошибку 400, если отсутствуют обязательные поля.
    }

    const addedCollections = collections.filter(
      (collectionId: string) => !product.collections.includes(collectionId)
    );
    // Находим коллекции, которые добавлены в новом продукте, но отсутствуют в старом.

    const removedCollections = product.collections.filter(
      (collectionId: string) => !collections.includes(collectionId)
    );
    // Находим коллекции, которые были в старом продукте, но отсутствуют в новом.

    // Обновляем коллекции.
    await Promise.all([
      // Добавляем продукт в новые коллекции.
      ...addedCollections.map((collectionId: string) =>
        Collection.findByIdAndUpdate(collectionId, {
          $push: { products: product._id },
        })
      ),

      // Удаляем продукт из старых коллекций.
      ...removedCollections.map((collectionId: string) =>
        Collection.findByIdAndUpdate(collectionId, {
          $pull: { products: product._id },
        })
      ),
    ]);

    // Обновляем продукт.
    const updatedProduct = await Product.findByIdAndUpdate(
      product._id,
      {
        title,
        description,
        media,
        category,
        collections,
        tags,
        sizes,
        colors,
        price,
        expense,
      },
      { new: true }
    ).populate({ path: "collections", model: Collection });

    await updatedProduct.save();
    // Сохраняем обновленный продукт в базе данных.

    return NextResponse.json(updatedProduct, { status: 200 });
    // Возвращаем обновленный продукт с статусом 200.
  } catch (err) {
    console.log("[productId_POST]", err);
    // Логируем ошибку при выполнении запроса.

    return new NextResponse("Internal error", { status: 500 });
    // Возвращаем ошибку 500 в случае возникновения исключения.
  }
};

export const DELETE = async (
  req: NextRequest,
  { params }: { params: { productId: string } }
) => {
  // Определяем асинхронную функцию для обработки DELETE-запросов.
  try {
    const { userId } = auth();
    // Получаем ID пользователя из контекста аутентификации.

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
      // Возвращаем ошибку 401, если пользователь не аутентифицирован.
    }

    await connectToDB();
    // Подключаемся к базе данных.

    const product = await Product.findById(params.productId);
    // Находим продукт по ID.

    if (!product) {
      return new NextResponse(
        JSON.stringify({ message: "Product not found" }),
        { status: 404 }
      );
      // Возвращаем ошибку 404, если продукт не найден.
    }

    await Product.findByIdAndDelete(product._id);
    // Удаляем продукт по ID.

    // Обновляем коллекции, удаляя ссылки на удаленный продукт.
    await Promise.all(
      product.collections.map((collectionId: string) =>
        Collection.findByIdAndUpdate(collectionId, {
          $pull: { products: product._id },
        })
      )
    );

    return new NextResponse(JSON.stringify({ message: "Product deleted" }), {
      status: 200,
    });
    // Возвращаем сообщение об успешном удалении продукта с статусом 200.
  } catch (err) {
    console.log("[productId_DELETE]", err);
    // Логируем ошибку при выполнении запроса.

    return new NextResponse("Internal error", { status: 500 });
    // Возвращаем ошибку 500 в случае возникновения исключения.
  }
};

export const dynamic = "force-dynamic";
// Экспортируем переменную dynamic с значением "force-dynamic", чтобы указать, что страница должна быть динамически рендерена на сервере.
