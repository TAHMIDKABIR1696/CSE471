import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  await prisma.doctor.deleteMany()

  await prisma.doctor.createMany({
    data: [
      {
        name: 'Dr. Amina Rahman',
        specialization: 'CARDIOLOGIST',
        experience: 15,
        degrees: ['MBBS', 'FCPS (Cardiology)', 'MD (Cardiology)'],
        concentrations: ['Cardiac Medicine', 'Congenital Heart Disease', 'Cardiac Rehabilitation', 'Heart Failure Management'],
        hospital: 'Dhaka Heart Center',
        chamber: 'Room 302',
        helpline: '+880-1234-567890',
        address: 'Gulshan-2, Dhaka',
        mapsLink: 'https://www.google.com/maps/search/?api=1&query=Dhaka+Heart+Center%2C+Gulshan-2%2C+Dhaka',
        rating: 4.7,
        credibilityScore: 0.72
      },
      {
        name: 'Dr. Farid Hasan',
        specialization: 'NEUROLOGIST',
        experience: 12,
        degrees: ['MBBS', 'MD (Neurology)', 'MRCP'],
        concentrations: ['Epilepsy', 'Stroke Management', 'Headache & Migraine', 'Neuromuscular Disorders'],
        hospital: 'Neuro Care Clinic',
        chamber: 'Suite 5B',
        helpline: '+880-1234-111222',
        address: 'Dhanmondi, Dhaka',
        mapsLink: 'https://www.google.com/maps/search/?api=1&query=Neuro+Care+Clinic%2C+Dhanmondi%2C+Dhaka',
        rating: 4.6,
        credibilityScore: 0.66
      },
      {
        name: 'Dr. Nusrat Jahan',
        specialization: 'DERMATOLOGIST',
        experience: 10,
        degrees: ['MBBS', 'DDV', 'FCPS (Dermatology)'],
        concentrations: ['Acne Treatment', 'Skin Allergy', 'Laser Treatment', 'Cosmetic Dermatology'],
        hospital: 'Skin & Laser Institute',
        chamber: 'Level 4',
        helpline: '+880-1234-333444',
        address: 'Banani, Dhaka',
        mapsLink: 'https://www.google.com/maps/search/?api=1&query=Skin+%26+Laser+Institute%2C+Banani%2C+Dhaka',
        rating: 4.5,
        credibilityScore: 0.62
      },
      {
        name: 'Dr. Imran Chowdhury',
        specialization: 'GENERAL_PHYSICIAN',
        experience: 8,
        degrees: ['MBBS', 'BCS (Health)', 'CCD'],
        concentrations: ['General Medicine', 'Diabetes Management', 'Infectious Diseases', 'Preventive Healthcare'],
        hospital: 'City Health Clinic',
        chamber: 'Room 12',
        helpline: '+880-1234-555666',
        address: 'Mirpur, Dhaka',
        mapsLink: 'https://www.google.com/maps/search/?api=1&query=City+Health+Clinic%2C+Mirpur%2C+Dhaka',
        rating: 4.4,
        credibilityScore: 0.57
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
