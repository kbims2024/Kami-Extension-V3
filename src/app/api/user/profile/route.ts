import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';
import { writeFile } from 'fs/promises';
import path from 'path';

// GET - Récupérer le profil d'un utilisateur
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'userId requis' }, { status: 400 });
    }

    const user = await User.findById(userId).lean();

    if (!user) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
    }

    const userData = {
      id: user._id.toString(),
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      email: user.email,
      isResident: user.isResident,
      referralCode: user.referralCode,
      profileImage: user.profileImage,
      idCard: user.idCard,
      selfie: user.selfie,
      status: user.status,
    };

    return NextResponse.json(userData);
  } catch (error) {
    console.error('Erreur lors de la récupération du profil:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

// PUT - Mettre à jour le profil d'un utilisateur
export async function PUT(request: NextRequest) {
  try {
    await connectDB();
    const formData = await request.formData();
    const userId = formData.get('userId') as string;
    const firstName = formData.get('firstName') as string;
    const lastName = formData.get('lastName') as string;
    const phone = formData.get('phone') as string;
    const email = formData.get('email') as string;
    const profileImage = formData.get('profileImage') as File | null;
    const idCard = formData.get('idCard') as File | null;
    const selfie = formData.get('selfie') as File | null;

    if (!userId) {
      return NextResponse.json({ error: 'userId requis' }, { status: 400 });
    }

    // Vérifier si l'utilisateur existe
    const existingUser = await User.findById(userId);

    if (!existingUser) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
    }

    // Helper pour gérer l'upload de fichiers
    const handleFileUpload = async (file: File | null, oldPath: string | null, type: 'profile' | 'idcard' | 'selfie') => {
      if (file && file.size > 0) {
        const fileExtension = file.name.split('.').pop() || 'jpg';
        const fileName = `${type}-${userId}-${Date.now()}.${fileExtension}`;
        const uploadDir = path.join(process.cwd(), 'public', 'uploads', type === 'profile' ? 'profiles' : type + 's');
        const filePath = path.join(uploadDir, fileName);
        await writeFile(filePath, Buffer.from(await file.arrayBuffer()));
        return `/uploads/${type === 'profile' ? 'profiles' : type + 's'}/${fileName}`;
      }
      return oldPath;
    };

    // Traiter les fichiers si fournis
    const profileImagePath = await handleFileUpload(profileImage, existingUser.profileImage, 'profile');
    const idCardPath = await handleFileUpload(idCard, existingUser.idCard, 'idcard');
    const selfiePath = await handleFileUpload(selfie, existingUser.selfie, 'selfie');

    // Préparer les données de mise à jour
    const updateData: any = {
      profileImage: profileImagePath,
      idCard: idCardPath,
      selfie: selfiePath,
    };

    if (firstName) updateData.firstName = firstName.trim();
    if (lastName) updateData.lastName = lastName.trim();
    if (phone) updateData.phone = phone.trim();
    if (email) updateData.email = email.trim();

    // Mettre à jour l'utilisateur
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true }
    ).lean();

    const userData = {
      id: updatedUser!._id.toString(),
      firstName: updatedUser!.firstName,
      lastName: updatedUser!.lastName,
      phone: updatedUser!.phone,
      email: updatedUser!.email,
      isResident: updatedUser!.isResident,
      referralCode: updatedUser!.referralCode,
      profileImage: updatedUser!.profileImage,
      idCard: updatedUser!.idCard,
      selfie: updatedUser!.selfie,
      status: updatedUser!.status,
    };

    return NextResponse.json(userData);
  } catch (error) {
    console.error('Erreur lors de la mise à jour du profil:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}