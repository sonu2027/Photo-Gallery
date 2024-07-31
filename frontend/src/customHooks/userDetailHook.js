import { useSelector } from "react-redux";

const useDetailHook = () => {
  const status = useSelector((s) => s.auth.status);
  const userId = useSelector((s) => s.auth.userData.userId);
  const userProfilePhoto = useSelector((s) => s.auth.userData.userProfilePhoto);
  const fullName = useSelector((s) => s.auth.userData.fullName);
  const email = useSelector((s) => s.auth.userData.email);
  const username = useSelector((s) => s.auth.userData.username);
  const password = useSelector((s) => s.auth.userData.password);
  console.log(
    "User detail is: ",
    status,
    userId,
    userProfilePhoto,
    fullName,
    username,
    email,
    password
  );

  return {
    status,
    userId,
    userProfilePhoto,
    fullName,
    username,
    email,
    password,
  };
};

export default useDetailHook
