import Course from "../models/course.model.js";
import User from "../models/user.model.js";

// Kurs qo'shish
const createCourse = async (req, res, next) => {
  try {
    const { title, description } = req.body;
    const course = new Course({
      title,
      description,
      teacher: req.user._id,
    });

    await course.save();
    res.status(201).json(course);
  } catch (error) {
    next(error);
  }
};

// Barcha kurslarni olish
const getCourses = async (req, res, next) => {
  try {
    const courses = await Course.find().populate("teacher", "name");
    res.status(200).json(courses);
  } catch (error) {
    next(error);
  }
};

// Kursni yangilash
const updateCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: "Kurs topilmadi" });
    }

    if (course.teacher.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Faqat oqituvchi kursni yangilay oladi" });
    }

    const updatedCourse = await Course.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedCourse);
  } catch (error) {
    next(error);
  }
};

// Kursni o'chirish
const deleteCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: "Kurs topilmadi" });
    }

    if (course.teacher.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Faqat oqituvchi kursni ochira oladi" });
    }

    await Course.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Kurs ochirildi" });
  } catch (error) {
    next(error);
  }
};

export { createCourse, getCourses, updateCourse, deleteCourse };
