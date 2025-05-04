import User from "../models/user.model.js";
import Course from "../models/course.model.js";


const enrollCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course) {
      return res.status(404).json({ message: "Kurs topilmadi" });
    }

    const user = await User.findById(req.user._id);
    if (user.enrolledCourses.includes(req.params.courseId)) {
      return res
        .status(400)
        .json({ message: "Siz allaqachon bu kursga yozilgansiz" });
    }

    user.enrolledCourses.push(req.params.courseId);
    await user.save();

    res.status(200).json({ message: "Kursga muvaffaqiyatli yozildingiz" });
  } catch (error) {
    next(error);
  }
};


const getMyCourses = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate("enrolledCourses");
    res.status(200).json(user.enrolledCourses);
  } catch (error) {
    next(error);
  }
};


const updateUser = async (req, res, next) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updatedUser) {
      return res.status(404).json({ message: "Foydalanuvchi topilmadi" });
    }
    res.status(200).json(updatedUser);
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "Foydalanuvchi topilmadi" });
    }
    res.status(200).json({ message: "Foydalanuvchi o‘chirildi" });
  } catch (error) {
    next(error);
  }
};

export { enrollCourse, getMyCourses, updateUser, deleteUser };
