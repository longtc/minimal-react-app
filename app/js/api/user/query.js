// let's pretend that below is a valid login method
export async function login(onSuccess) {
  const res = { user: "hello", accessToken: "asdqwe" };
  onSuccess(res);
}
