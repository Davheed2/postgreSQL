import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bodyParser from "body-parser";

const app = express();
app.use(bodyParser.json());
const prisma = new PrismaClient();
const PORT = 3000;

//USERS
app.get("/users", async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      //You can also use the where to filter using the equals and not method
      where: {
        //name: { equals: "David" },
        //in or notIn accepts an array when filtering
        //name: {in: ["David"]},
        //Passing 2 fields is more like passing an AND operator or you can use the AND operator at once or other types of operators
        //eg
        //email: {startsWith: "1@2"},
        //you can also query on one to many relationships like this on a post
        // posts: {
        //   every: {
        //     title: "TEST",
        //   },
        // },
      },
      select: {
        id: true,
        email: true,
        posts: true,
        role: true,
        name: true,
        jokes: {
          include: {
            creator: true,
          },
        },
      },

      // include: {
      //   posts: true,
      //   jokes: true,
      // },

      //for Pagination
      //distinct: ["name", "email"],
      //distinct works when we are filtering so many users with identical values
      //take: 2,
      //take works by returning the specified amount eg 2
      //skip: 1
      //skips a certain amount
    });
    return res.json({ users });
  } catch (err: any) {
    console.log(err);
  }
});

app.get("/user/:id", async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: req.params.id,
      },
      include: {
        posts: true,
        jokes: true,
      },
    });
    return res.json({ user });
  } catch (err: any) {
    console.log(err);
  }
});

app.post("/user", async (req: Request, res: Response) => {
  try {
    //you can also use the connect method when creating a user to another existing field
    const user = await prisma.user.create({
      data: {
        name: req.body.name,
        email: req.body.email,
      },
    });

    return res.json({ user });
  } catch (err: any) {
    console.log(err);
  }
});

app.put("/user/:id", async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.update({
      where: { id: req.params.id },
      data: req.body,

      //you can also add the include methods
      //update has special features when working with numbers in a field eg incrementing, decrementing, dividing and multiplication

      //you can also use the connect{connect: {id: "...."}} or the disconnect{disconnect: true} to add or to remove fields to already existing models, eg a particular user to an existing post
    });

    return res.json({ user });
  } catch (err: any) {
    console.log(err.message);
  }
});

app.delete("/users", async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.deleteMany();

    if (!users) {
      return res.status(404).json({ message: "no user found" });
    }

    return res.json({ users });
  } catch (err: any) {
    console.log(err.message);
  }
});

app.delete("/user/:id", async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: req.params.id,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "no user found" });
    }

    await prisma.user.delete({
      where: {
        id: user.id,
      },
    });

    return res.json({ user });
  } catch (err: any) {
    console.log(err.message);
  }
});

//Jokes
app.get("/jokes", async (req: Request, res: Response) => {
  try {
    const jokes = await prisma.joke.findMany({
      //filtering deeper
      // where: {
      //   creator: {
      //     email: {
      //       startsWith: "1@2",
      //     },
      //   },
      // },
      //if the where is not included so it can populate the creators
      include: {
        creator: true,
      },
    });

    return res.json({ jokes });
  } catch (err: any) {
    console.log(err);
  }
});

app.get("/joke/:id", async (req: Request, res: Response) => {
  try {
    const joke = await prisma.joke.findUnique({
      where: {
        id: req.params.id,
      },
      include: {
        creator: true,
      },
    });

    return res.json({ joke });
  } catch (err: any) {
    console.log(err);
  }
});

app.post("/joke", async (req: Request, res: Response) => {
  //5c24de4b-f27a-4732-9644-016d522116f1
  try {
    const joke = await prisma.joke.create({
      data: {
        text: req.body.text,
        //userId: req.body.user,
        //Usage of the connect
        creator: {
          connect: {
            id: "5c24de4b-f27a-4732-9644-016d522116f1",
          },
        },
      },
    });

    return res.json({ joke });
  } catch (err: any) {
    console.log(err);
  }
});

app.put("/joke/:id", async (req: Request, res: Response) => {
  try {
    const joke = await prisma.joke.update({
      where: {
        id: req.params.id,
      },
      data: {
        creator: {
          //note connecting this joke reassigns the particular joke to another user
          connect: {
            id: "30257770-b139-4268-ba00-dcbae8628d24",
          },
        },
        text: req.body.text,
      },
    });

    return res.json({ joke });
  } catch (err) {
    console.log(err);
  }
});

app.delete("/jokes", async (req: Request, res: Response) => {
  const jokes = await prisma.joke.deleteMany();

  if (!jokes) {
    return res.status(404).json({ message: "no joke found" });
  }

  return res.json({ message: "jokes deleted", jokes });
});

app.delete("/joke/:id", async (req: Request, res: Response) => {
  try {
    const joke = await prisma.joke.findUnique({
      where: {
        id: req.params.id,
      },
    });

    if (!joke) {
      return res.status(404).json({ message: "no joke found" });
    }

    await prisma.joke.delete({
      where: {
        id: joke.id,
      },
    });

    return res.json({ joke });
  } catch (err: any) {
    console.log(err.message);
  }
});

///POSTS
app.get("/posts", async (req: Request, res: Response) => {
  try {
    const posts = await prisma.post.findMany({
      include: {
        creator: true,
      },
    });

    return res.json({ posts });
  } catch (err: any) {
    console.log(err);
  }
});

app.get("/post/:id", async (req: Request, res: Response) => {
  try {
    const post = await prisma.post.findUnique({
      where: {
        id: req.params.id,
      },
      include: {
        creator: true,
      },
    });

    return res.json({ post });
  } catch (err: any) {
    console.log(err);
  }
});

app.post("/post", async (req: Request, res: Response) => {
  try {
    const post = await prisma.post.create({
      data: {
        title: req.body.title,
        //creator: req.body.user,
        content: req.body.content,
        creator: {
          connect: {
            id: "5c24de4b-f27a-4732-9644-016d522116f1",
          },
        },
      },
    });

    return res.json({ post });
  } catch (err: any) {
    console.log(err);
  }
});

app.put("/post/:id", async (req: Request, res: Response) => {
  try {
    const post = await prisma.post.update({
      //IN A REAL APP CHECK IF THE POST BELONGS TO THE USER BEFORE UPDATING
      where: {
        id: req.params.id,
      },
      data: {
        title: req.body.title,
        content: req.body.content,
        published: {
          set: true,
        },
      },
    });

    return res.json({ post });
  } catch (err: any) {
    console.log(err);
  }
});

app.delete("/posts", async (req: Request, res: Response) => {
  const posts = await prisma.post.deleteMany();

  if (!posts) {
    return res.status(404).json({ message: "no post found" });
  }

  return res.json({ message: "jokes deleted", posts });
});

app.delete("/post/:id", async (req: Request, res: Response) => {
  try {
    const post = await prisma.post.findUnique({
      where: {
        id: req.params.id,
      },
    });

    if (!post) {
      return res.status(404).json({ message: "no post found" });
    }

    await prisma.post.delete({
      where: {
        id: post.id,
      },
    });

    return res.json({ post });
  } catch (err: any) {
    console.log(err.message);
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
