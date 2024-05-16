import { connectToDB } from "@/lib/mongoDB";
// Импортируем функцию для подключения к базе данных из указанного пути.

import { auth } from "@clerk/nextjs";
// Импортируем функцию аутентификации из библиотеки @clerk/nextjs.

import { NextRequest, NextResponse } from "next/server";
// Импортируем NextRequest и NextResponse из библиотеки Next.js для обработки серверных запросов и ответов.

import Collection from "@/lib/models/Collection";
// Импортируем модель Collection из указанного пути.

export const POST = async (req: NextRequest) => {
  // Определяем асинхронную функцию для обработки POST-запросов.
  try {
    const { userId } = auth();
    // Получаем ID пользователя из контекста аутентификации.

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 403 });
      // Возвращаем ошибку 403, если пользователь не аутентифицирован.
    }

    await connectToDB();
    // Подключаемся к базе данных.

    const { title, description, image } = await req.json();
    // Получаем данные из тела запроса.

    const existingCollection = await Collection.findOne({ title });
    // Проверяем, существует ли коллекция с таким же названием.

    if (existingCollection) {
      return new NextResponse("Collection already exists", { status: 400 });
      // Возвращаем ошибку 400, если коллекция с таким названием уже существует.
    }

    if (!title || !image) {
      return new NextResponse("Title and image are required", { status: 400 });
      // Возвращаем ошибку 400, если отсутствуют обязательные поля title и image.
    }

    const newCollection = await Collection.create({
      title,
      description,
      image,
    });
    // Создаем новую коллекцию.

    await newCollection.save();
    // Сохраняем новую коллекцию в базе данных.

    return NextResponse.json(newCollection, { status: 200 });
    // Возвращаем созданную коллекцию с статусом 200.
  } catch (err) {
    console.log("[collections_POST]", err);
    // Логируем ошибку при выполнении запроса.

    return new NextResponse("Internal Server Error", { status: 500 });
    // Возвращаем ошибку 500 в случае возникновения исключения.
  }
};

export const GET = async (req: NextRequest) => {
  // Определяем асинхронную функцию для обработки GET-запросов.
  try {
    await connectToDB();
    // Подключаемся к базе данных.

    const collections = await Collection.find().sort({ createdAt: "desc" });
    // Получаем все коллекции, отсортированные по дате создания в порядке убывания.

    return NextResponse.json(collections, { status: 200 });
    // Возвращаем найденные коллекции с статусом 200.
  } catch (err) {
    console.log("[collections_GET]", err);
    // Логируем ошибку при выполнении запроса.

    return new NextResponse("Internal Server Error", { status: 500 });
    // Возвращаем ошибку 500 в случае возникновения исключения.
  }
};

export const dynamic = "force-dynamic";
// Экспортируем переменную dynamic с значением "force-dynamic", чтобы указать, что страница должна быть динамически рендерена на сервере.
