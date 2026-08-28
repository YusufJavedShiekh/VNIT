import { useEffect, useState } from "react";

function Settings({ officer, onLogout }) {
  const [profile, setProfile] = useState({
    name: officer?.name || "",
    userId: officer?.userId || "",
    station: officer?.station || "",
    phone: officer?.phone || "",
    email: officer?.email || "",
    address: officer?.address || "",
    photo: officer?.photo || "",
  });

  const [theme, setTheme] = useState(
    sessionStorage.getItem("vigil_theme") || "light"
  );

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  /* ==========================================================
     APPLY THEME
     ========================================================== */

  useEffect(() => {
    document.documentElement.classList.toggle(
      "dark",
      theme === "dark"
    );

    sessionStorage.setItem(
      "vigil_theme",
      theme
    );
  }, [theme]);

  /* ==========================================================
     PROFILE INPUT
     ========================================================== */

  const handleChange = (event) => {
    const { name, value } = event.target;

    setProfile((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  /* ==========================================================
     PHOTO
     ========================================================== */

  const handlePhotoChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file.");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setError("Profile photo must be smaller than 2 MB.");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      setProfile((previous) => ({
        ...previous,
        photo: reader.result,
      }));

      setError("");
    };

    reader.readAsDataURL(file);
  };

  const removePhoto = () => {
    setProfile((previous) => ({
      ...previous,
      photo: "",
    }));
  };

  /* ==========================================================
     SAVE PROFILE
     ========================================================== */

  const saveProfile = () => {
    setError("");
    setMessage("");

    if (!profile.name.trim()) {
      setError("Name cannot be empty.");
      return;
    }

    if (!profile.phone.trim()) {
      setError("Mobile number is required.");
      return;
    }

    if (!profile.email.trim()) {
      setError("Email address is required.");
      return;
    }

    if (!profile.address.trim()) {
      setError("Address is required.");
      return;
    }

    const updatedSession = {
      ...officer,
      ...profile,
    };

    sessionStorage.setItem(
      "vigil_session",
      JSON.stringify(updatedSession)
    );

    /* --------------------------------------------------------
       Update temporary account
       -------------------------------------------------------- */

    const savedAccounts =
      sessionStorage.getItem("vigil_accounts");

    if (savedAccounts) {
      try {
        const accounts = JSON.parse(savedAccounts);

        const updatedAccounts = accounts.map(
          (account) => {
            if (
              account.userId ===
              officer.userId
            ) {
              return {
                ...account,
                name: profile.name,
                phone: profile.phone,
                email: profile.email,
                address: profile.address,
                photo: profile.photo,
              };
            }

            return account;
          }
        );

        sessionStorage.setItem(
          "vigil_accounts",
          JSON.stringify(updatedAccounts)
        );
      } catch {
        console.error(
          "Unable to update account."
        );
      }
    }

    setMessage(
      "Profile updated successfully."
    );
  };

  /* ==========================================================
     CHANGE PASSWORD
     ========================================================== */

  const changePassword = () => {
    setError("");
    setMessage("");

    if (
      !passwordData.currentPassword ||
      !passwordData.newPassword ||
      !passwordData.confirmPassword
    ) {
      setError(
        "Please complete all password fields."
      );

      return;
    }

    if (
      passwordData.newPassword.length < 6
    ) {
      setError(
        "New password must contain at least 6 characters."
      );

      return;
    }

    if (
      passwordData.newPassword !==
      passwordData.confirmPassword
    ) {
      setError(
        "New passwords do not match."
      );

      return;
    }

    const savedAccounts =
      sessionStorage.getItem("vigil_accounts");

    if (!savedAccounts) {
      setError(
        "Account information could not be found."
      );

      return;
    }

    try {
      const accounts =
        JSON.parse(savedAccounts);

      const accountIndex =
        accounts.findIndex(
          (account) =>
            account.userId ===
            officer.userId
        );

      if (accountIndex === -1) {
        setError(
          "Account could not be found."
        );

        return;
      }

      if (
        accounts[accountIndex].password !==
        passwordData.currentPassword
      ) {
        setError(
          "Current password is incorrect."
        );

        return;
      }

      accounts[accountIndex].password =
        passwordData.newPassword;

      sessionStorage.setItem(
        "vigil_accounts",
        JSON.stringify(accounts)
      );

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      setMessage(
        "Password changed successfully."
      );
    } catch {
      setError(
        "Unable to change password."
      );
    }
  };

  return (
    <div className="p-4 md:p-6 lg:p-8">

      {/* ====================================================
          HEADER
          ==================================================== */}

      <div className="mb-8">

        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          VIGIL Settings
        </h1>

        <p className="mt-2 text-slate-500 dark:text-slate-400">
          Manage your officer profile, account security,
          and appearance preferences.
        </p>

      </div>


      {/* ====================================================
          MESSAGES
          ==================================================== */}

      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {message && (
        <div className="mb-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {message}
        </div>
      )}


      <div className="max-w-5xl space-y-6">


        {/* ==================================================
            OFFICER PROFILE
            ================================================== */}

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">

          <div className="mb-6">

            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Officer Profile
            </h2>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Your personal and officer information.
            </p>

          </div>


          {/* PROFILE PHOTO */}

          <div className="mb-8 flex flex-col items-center gap-4 sm:flex-row">

            {profile.photo ? (
              <img
                src={profile.photo}
                alt="Officer"
                className="h-28 w-28 rounded-full object-cover border-4 border-slate-100"
              />
            ) : (
              <div className="flex h-28 w-28 items-center justify-center rounded-full bg-blue-100 text-4xl">
                👮
              </div>
            )}

            <div>

              <h3 className="font-semibold text-slate-900 dark:text-white">
                Profile Photo
              </h3>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                JPG, PNG or WEBP. Maximum 2 MB.
              </p>

              <div className="mt-3 flex flex-wrap gap-2">

                <label className="cursor-pointer rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">

                  Change Photo

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="hidden"
                  />

                </label>

                {profile.photo && (
                  <button
                    type="button"
                    onClick={removePhoto}
                    className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                  >
                    Remove
                  </button>
                )}

              </div>

            </div>

          </div>


          {/* PROFILE FORM */}

          <div className="grid gap-5 md:grid-cols-2">

            <Field
              label="Full Name"
              name="name"
              value={profile.name}
              onChange={handleChange}
            />

            <Field
              label="Mobile Number"
              name="phone"
              value={profile.phone}
              onChange={handleChange}
              type="tel"
              placeholder="Enter mobile number"
            />

            <Field
              label="Email Address"
              name="email"
              value={profile.email}
              onChange={handleChange}
              type="email"
              placeholder="Enter email address"
            />

            <Field
              label="User ID"
              value={profile.userId}
              disabled
            />

            <Field
              label="Police Station"
              value={profile.station}
              disabled
            />

          </div>


          <div className="mt-5">

            <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
              Address
            </label>

            <textarea
              name="address"
              value={profile.address}
              onChange={handleChange}
              rows="3"
              placeholder="Enter your address"
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
            />

          </div>


          <button
            type="button"
            onClick={saveProfile}
            className="mt-6 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            Save Profile
          </button>

        </section>


        {/* ==================================================
            SECURITY
            ================================================== */}

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">

          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Account Security
          </h2>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Change your VIGIL account password.
          </p>


          <div className="mt-6 max-w-xl space-y-4">

            <Field
              label="Current Password"
              type="password"
              value={
                passwordData.currentPassword
              }
              onChange={(event) =>
                setPasswordData({
                  ...passwordData,
                  currentPassword:
                    event.target.value,
                })
              }
            />

            <Field
              label="New Password"
              type="password"
              value={
                passwordData.newPassword
              }
              onChange={(event) =>
                setPasswordData({
                  ...passwordData,
                  newPassword:
                    event.target.value,
                })
              }
            />

            <Field
              label="Confirm New Password"
              type="password"
              value={
                passwordData.confirmPassword
              }
              onChange={(event) =>
                setPasswordData({
                  ...passwordData,
                  confirmPassword:
                    event.target.value,
                })
              }
            />

            <button
              type="button"
              onClick={changePassword}
              className="rounded-xl border border-slate-300 px-6 py-3 font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-700"
            >
              Change Password
            </button>

          </div>

        </section>


        {/* ==================================================
            APPEARANCE
            ================================================== */}

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">

          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Appearance
          </h2>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Choose how the VIGIL dashboard should appear.
          </p>


          <div className="mt-6 grid gap-4 sm:grid-cols-2">

            <button
              type="button"
              onClick={() => setTheme("light")}
              className={`rounded-xl border-2 p-5 text-left transition ${
                theme === "light"
                  ? "border-blue-600 bg-blue-50"
                  : "border-slate-200 hover:border-slate-300"
              }`}
            >

              <div className="text-3xl">
                ☀️
              </div>

              <h3 className="mt-3 font-bold">
                Light Theme
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Recommended for normal daytime operations.
              </p>

            </button>


            <button
              type="button"
              onClick={() => setTheme("dark")}
              className={`rounded-xl border-2 p-5 text-left transition ${
                theme === "dark"
                  ? "border-blue-600 bg-blue-50"
                  : "border-slate-200 hover:border-slate-300"
              }`}
            >

              <div className="text-3xl">
                🌙
              </div>

              <h3 className="mt-3 font-bold">
                Dark Theme
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                More suitable for low-light environments.
              </p>

            </button>

          </div>

        </section>


        {/* ==================================================
            SESSION
            ================================================== */}

        <section className="rounded-2xl border border-red-200 bg-white p-6 shadow-sm dark:border-red-900 dark:bg-slate-800">

          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Session
          </h2>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Sign out of the current VIGIL officer session.
          </p>

          <button
            type="button"
            onClick={onLogout}
            className="mt-5 rounded-xl bg-red-600 px-6 py-3 font-semibold text-white hover:bg-red-700"
          >
            Logout
          </button>

        </section>

      </div>

    </div>
  );
}


/* ============================================================
   FIELD COMPONENT
   ============================================================ */

function Field({
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder = "",
  disabled = false,
}) {
  return (
    <div>

      <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
        {label}
      </label>

      <input
        name={name}
        type={type}
        value={value || ""}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className={`w-full rounded-xl border px-4 py-3 outline-none transition ${
          disabled
            ? "cursor-not-allowed bg-slate-100 text-slate-500 dark:bg-slate-700"
            : "border-slate-200 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
        }`}
      />

    </div>
  );
}

export default Settings;