import { NextRequest, NextResponse } from 'next/server';
import { createUser } from '@/factories/userFactory';
import { DisplayUserDO } from '@/types/user/DisplayUserDO';
import { CreateUserDO } from '@/types/user/CreateUserDO';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const userToRegister : CreateUserDO = {
        user_name: body.user_name, 
        full_name: body.full_name,
        pwd: body.pwd,
        email: body.email,
        phone: body.phone,
        notes : body.notes,
        created_by : body.created_by
    };
    console.log("User to register : ", userToRegister);
    const newUser: DisplayUserDO|null = await createUser(userToRegister);
    return NextResponse.json({ message: "Succès : Création d'utilisateur", registeredUser: newUser }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Echec : Création d'utilisateur" }, { status: 500 });
  }
}