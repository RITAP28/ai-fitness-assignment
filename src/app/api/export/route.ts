import { NextResponse } from 'next/server';
import puppeteer from 'puppeteer';

interface IDietPlanProps {
    dietPreference: "veg" | "non-veg" | "vegan" | "keto",
    caloriesTarget: string
    meals: {
        itemId: string
        mealType: string
        totalCalories: string
        name: string
        quantity: string
        calories: string
        macros: {
            protein: string
            carbs: string
            fats: string
        },
        imageUrl?: string
    }[]
}

interface IClientWorkoutPlanProps {
    id: string
    userId: string
    fitnessGoal: "Weight Loss" | "Muscle Gain" | "General Fitness" | "Strength Training"
    fitnessLevel: "beginner" | "intermediate" | "advanced"
    workoutLocation: "home" | "gym" | "outdoor"
    planDuration: string
    days: {
        id: string
        userId: string
        planId: string
        day: string
        focusArea: string
        exercises: {
            id: string
            name: string
            sets: string
            reps: string
            restTime: string
            imageUrl?: string
            description: string
        }[],
        diet: IDietPlanProps
    }[],
    createdAt: Date
    updatedAt: Date
}

export async function POST(req: Request) {
  const { plan } = await req.json();
  const overallPlan = JSON.parse(plan) as IClientWorkoutPlanProps[];

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  const html = `
  <html>
  <body>
    <h1>${plan.fitnessGoal} Plan</h1>
    <h3>Fitness Level: ${plan.fitnessLevel}</h3>
    <h3>Location: ${plan.workoutLocation}</h3>
    <hr />

    ${overallPlan[0].days.map(day => `
      <h2>${day.day} — ${day.focusArea}</h2>
      <h3>Workout</h3>
      <ul>
        ${day.exercises.map(ex => `
          <li>
            <b>${ex.name}</b> — ${ex.sets} sets x ${ex.reps} reps (${ex.restTime} rest)
          </li>
        `).join("")}
      </ul>

      <h3>Diet</h3>
      <ul>
        ${Object.entries(day.diet.meals).map(([meal, items]) => `
          <li>
            <b>${meal.toUpperCase()}</b>: ${items.name}
          </li>
        `).join("")}
      </ul>
      <hr />
    `).join("")}
  </body>
  </html>`;

  await page.setContent(html);
  const pdf = await page.pdf({ format: "A4" });
  await browser.close();

  const uint8 = new Uint8Array(pdf);
  const arrayBuffer = uint8.buffer.slice(uint8.byteOffset, uint8.byteOffset + uint8.byteLength);
  const blob = new Blob([arrayBuffer], { type: "application/pdf" });

  return new NextResponse(blob, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="plan.pdf"`
    }
  });
}