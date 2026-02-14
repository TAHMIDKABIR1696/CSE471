import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  await prisma.doctor.deleteMany()

  await prisma.doctor.createMany({
    data: [
      {
        name: 'Dr. Amina Rahman',
        specialization: 'CARDIOLOGIST',
        hospital: 'Dhaka Heart Center',
        chamber: 'Room 302',
        helpline: '+880-1234-567890',
        address: 'Gulshan-2, Dhaka',
        mapsLink: 'https://maps.google.com/?q=Gulshan-2+Dhaka',
        rating: 4.7
      },
      {
        name: 'Dr. Farid Hasan',
        specialization: 'NEUROLOGIST',
        hospital: 'Neuro Care Clinic',
        chamber: 'Suite 5B',
        helpline: '+880-1234-111222',
        address: 'Dhanmondi, Dhaka',
        mapsLink: 'https://maps.google.com/?q=Dhanmondi+Dhaka',
        rating: 4.6
      },
      {
        name: 'Dr. Nusrat Jahan',
        specialization: 'DERMATOLOGIST',
        hospital: 'Skin & Laser Institute',
        chamber: 'Level 4',
        helpline: '+880-1234-333444',
        address: 'Banani, Dhaka',
        mapsLink: 'https://maps.google.com/?q=Banani+Dhaka',
        rating: 4.5
      },
      {
        name: 'Dr. Imran Chowdhury',
        specialization: 'GENERAL_PHYSICIAN',
        hospital: 'City Health Clinic',
        chamber: 'Room 12',
        helpline: '+880-1234-555666',
        address: 'Mirpur, Dhaka',
        mapsLink: 'https://maps.google.com/?q=Mirpur+Dhaka',
        rating: 4.4
      }
    ]
  })
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
