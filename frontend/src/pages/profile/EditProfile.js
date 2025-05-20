import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Card from "../../components/card/Card";
import Loader from "../../components/loader/Loader";
import { selectUser, SET_NAME, SET_USER } from "../../redux/features/auth/authSlice";
import "./EditProfile.scss";
import { toast } from "react-toastify";
import { updateUser, getUser } from "../../services/services";
import ChangePassword from "../../components/changePassword/ChangePassword";

const EditProfile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const user = useSelector(selectUser);
  const { email } = user;

  useEffect(() => {
    if (!email) navigate("/profile");
  }, [email, navigate]);

  const initialState = {
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    bio: user?.bio || "",
    photo: user?.photo || "",
  };

  const [profile, setProfile] = useState(initialState);
  const [profileImage, setProfileImage] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setProfileImage(file);

    // Preview the image
    if (file) {
      const imagePreview = URL.createObjectURL(file);
      setProfile((prev) => ({ ...prev, photo: imagePreview }));
    }
  };

  const saveProfile = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let imageURL = profile.photo;

      // Upload new image to Cloudinary
      if (
        profileImage &&
        ["image/jpeg", "image/jpg", "image/png"].includes(profileImage.type)
      ) {
        const image = new FormData();
        image.append("file", profileImage);
        image.append("cloud_name", "dgyaag3vt");
        image.append("upload_preset", "my_unsigned_preset");

        const res = await fetch("https://api.cloudinary.com/v1_1/dgyaag3vt/image/upload", {
          method: "POST",
          body: image,
        });

        const imgData = await res.json();
        if (imgData?.url) {
          imageURL = imgData.url.toString();
        } else {
          throw new Error("Image upload failed");
        }
      }

      // Prepare and send updated data
      const formData = {
        name: profile.name,
        phone: profile.phone,
        bio: profile.bio,
        photo: imageURL,
      };

      const updated = await updateUser(formData);
      console.log(updated);

      // Fetch updated data and update Redux
      const data = await getUser();
      dispatch(SET_USER(data));
      dispatch(SET_NAME(data.name));

      toast.success("User updated successfully");
      navigate("/profile");
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="profile --my2">
      {isLoading && <Loader />}

      <Card cardClass="card --flex-dir-column">
        <div className="profile-photo">
          <img
            src={profile.photo || "https://via.placeholder.com/130"}
            alt="profile pic"
          />
        </div>

        <form className="--form-control --m" onSubmit={saveProfile}>
          <div className="profile-data">
            <p>
              <label>Name:</label>
              <input
                type="text"
                name="name"
                value={profile.name}
                onChange={handleInputChange}
                required
              />
            </p>
            <p>
              <label>Email:</label>
              <input type="email" value={profile.email} disabled />
              <br />
              <code className="code">Email cannot be changed.</code>
            </p>
            <p>
              <label>Phone:</label>
              <input
                type="text"
                name="phone"
                value={profile.phone}
                onChange={handleInputChange}
              />
            </p>
            <p>
              <label>Bio:</label>
              <textarea
                name="bio"
                value={profile.bio}
                onChange={handleInputChange}
                rows="4"
              ></textarea>
            </p>
            <p>
              <label>Photo:</label>
              <input type="file" name="image" onChange={handleImageChange} />
            </p>
            <div>
              <button type="submit" className="--btn --btn-primary">
                Edit Profile
              </button>
            </div>
          </div>
        </form>
      </Card>

      <br />
      <ChangePassword />
    </div>
  );
};

export default EditProfile;
