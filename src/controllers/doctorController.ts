import Doctor from "../models/Doctor";

export const getDoctors = async () => {
  try {
    return await Doctor.find()
  } catch (error) {
    console.error("Error fetching doctors:", error);
    throw new Error("Failed to fetch doctors");
  }
};

export const addDoctor = async (data: {
  name: string;
  location: string;
  specialist: { name: string; description: string }[];
}) => {
  try {
    if (!data.name) throw new Error("Name is required");
    if (!data.location) throw new Error("Location is required");
    if (!Array.isArray(data.specialist) || data.specialist.length === 0) {
      throw new Error("Specialist must include at least one specialization");
    }

    const doctor = new Doctor(data);
    return await doctor.save();
  } catch (error) {
    console.error("Error adding doctor:", error);
    throw new Error(error instanceof Error ? error.message : "Failed to add doctor");
  }
};