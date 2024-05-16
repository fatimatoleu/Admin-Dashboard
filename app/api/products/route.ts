import { auth } from "@clerk/nextjs";
// Импортируем функцию аутентификации из библиотеки @clerk/nextjs.

import { NextRequest, NextResponse } from "next/server";
// Импортируем NextRequest и NextResponse из библиотеки Next.js для обработки серверных запросов и ответов.

import { connectToDB } from "@/lib/mongoDB";
// Импортируем функцию для подключения к базе данных из указанного пути.

import Product from "@/lib/models/Product";
// Импортируем модель Product из указанного пути.

import Collection from "@/lib/models/Collection";
// Импортируем модель Collection из указанного пути.

export const POST = async (req: NextRequest) => {
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
      return new NextResponse("Not enough data to create a product", {
        status: 400,
      });
      // Возвращаем ошибку 400, если отсутствуют обязательные поля.
    }

    const newProduct = await Product.create({
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
    });
    // Создаем новый продукт с указанными данными.

    await newProduct.save();
    // Сохраняем новый продукт в базе данных.

    if (collections) {
      for (const collectionId of collections) {
        const collection = await Collection.findById(collectionId);
        if (collection) {
          collection.products.push(newProduct._id);
          await collection.save();
        }
      }
    }
    // Если указаны коллекции, добавляем новый продукт в каждую из них и сохраняем изменения.

    return NextResponse.json(newProduct, { status: 200 });
    // Возвращаем созданный продукт с статусом 200.
  } catch (err) {
    console.log("[products_POST]", err);
    // Логируем ошибку при выполнении запроса.

    return new NextResponse("Internal Error", { status: 500 });
    // Возвращаем ошибку 500 в случае возникновения исключения.
  }
};

export const GET = async (req: NextRequest) => {
  // Определяем асинхронную функцию для обработки GET-запросов.
  try {
    await connectToDB();
    // Подключаемся к базе данных.

    const products = await Product.find()
      .sort({ createdAt: "desc" })
      .populate({ path: "collections", model: Collection });
    // Находим все продукты, отсортированные по дате создания в порядке убывания, и заполняем поле collections данными из модели Collection.

    return NextResponse.json(products, { status: 200 });
    // Возвращаем найденные продукты с статусом 200.
  } catch (err) {
    console.log("[products_GET]", err);
    // Логируем ошибку при выполнении запроса.

    return new NextResponse("Internal Error", { status: 500 });
    // Возвращаем ошибку 500 в случае возникновения исключения.
  }
};

export const dynamic = "force-dynamic";
// Экспортируем переменную dynamic с значением "force-dynamic", чтобы указать, что страница должна быть динамически рендерена на сервере.
