export const dynamic = 'force-static';
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// Helper: convert a File to a base64 data URI
async function fileToDataUri(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  return `data:${file.type};base64,${buffer.toString('base64')}`;
}

// GET /api/user/profile?userId=xxx
export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId');
    if (!userId) {
      return NextResponse.json({ error: 'userId requis' }, { status: 400 });
    }

    const user = await db.user.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
    }

    return NextResponse.json({
      id: user.id,
      name: user.name,
      pseudo: user.pseudo,
      phone: user.phone,
      email: user.email,
      isResident: user.isResident,
      quartier: user.quartier,
      referralCode: user.referralCode,
      status: user.status,
      role: user.role,
      profilePhoto: (user as any).profilePhoto,
    });
  } catch (error) {
    console.error('Erreur profil GET:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

// PUT /api/user/profile - Mettre à jour le profil
export async function PUT(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type') || '';
    const isMultipart = contentType.includes('multipart/form-data');

    let userId: string;
    let name: string | undefined;
    let pseudo: string | undefined;
    let phone: string | undefined;
    let email: string | undefined;
    let quartier: string | undefined;
    let profilePhotoDataUri: string | undefined;

    if (isMultipart) {
      const formData = await request.formData();
      userId = (formData.get('userId') as string) || '';
      name = (formData.get('name') as string) || undefined;
      pseudo = (formData.get('pseudo') as string) || undefined;
      phone = (formData.get('phone') as string) || undefined;
      email = (formData.get('email') as string) || undefined;
      quartier = (formData.get('quartier') as string) || undefined;

      const photoFile = formData.get('profilePhoto') as File | null;
      if (photoFile && photoFile.size > 0) {
        // Validate image type
        const validImageTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
        if (!validImageTypes.includes(photoFile.type)) {
          return NextResponse.json(
            { error: "Format d'image non supporté (JPEG, PNG, WebP ou GIF requis)" },
            { status: 400 }
          );
        }
        // Validate image size (max 5MB)
        if (photoFile.size > 5 * 1024 * 1024) {
          return NextResponse.json(
            { error: "La photo ne doit pas dépasser 5 Mo" },
            { status: 400 }
          );
        }
        profilePhotoDataUri = await fileToDataUri(photoFile);
      }
    } else {
      const body = await request.json();
      userId = body.userId;
      name = body.name;
      pseudo = body.pseudo;
      phone = body.phone;
      email = body.email;
      quartier = body.quartier;
    }

    if (!userId) {
      return NextResponse.json({ error: 'userId requis' }, { status: 400 });
    }

    const existingUser = await db.user.findUnique({ where: { id: userId } });
    if (!existingUser) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
    }

    // Validation
    if (name && name.trim().length < 2) {
      return NextResponse.json({ error: 'Le nom doit contenir au moins 2 caractères' }, { status: 400 });
    }

    if (pseudo !== undefined && pseudo.trim().length < 2) {
      return NextResponse.json({ error: 'Le pseudo doit contenir au moins 2 caractères' }, { status: 400 });
    }

    if (quartier && !existingUser.isResident) {
      return NextResponse.json({ error: 'Le quartier est réservé aux résidents KAMI' }, { status: 400 });
    }

    const validQuartiers = ['ASSAKLA', "N'GLOH", "N'ZOKLOH", "N'GUOUAH"];
    if (quartier && existingUser.isResident && !validQuartiers.includes(quartier)) {
      return NextResponse.json({ error: 'Quartier invalide' }, { status: 400 });
    }

    // Construction des données de mise à jour
    const updateData: Record<string, any> = {};
    if (name !== undefined) updateData.name = name.trim();
    if (pseudo !== undefined) updateData.pseudo = pseudo.trim();
    if (phone !== undefined) updateData.phone = phone.trim();
    if (email !== undefined) updateData.email = email.trim() || null;
    if (existingUser.isResident && quartier !== undefined) {
      updateData.quartier = quartier || null;
    }
    if (profilePhotoDataUri !== undefined) {
      updateData.profilePhoto = profilePhotoDataUri;
    }

    const updatedUser = await db.user.update({
      where: { id: userId },
      data: updateData,
    });

    return NextResponse.json({
      id: updatedUser.id,
      name: updatedUser.name,
      pseudo: updatedUser.pseudo,
      phone: updatedUser.phone,
      email: updatedUser.email,
      isResident: updatedUser.isResident,
      quartier: updatedUser.quartier,
      referralCode: updatedUser.referralCode,
      status: updatedUser.status,
      role: updatedUser.role,
      profilePhoto: (updatedUser as any).profilePhoto,
    });
  } catch (error) {
    console.error('Erreur profil PUT:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
