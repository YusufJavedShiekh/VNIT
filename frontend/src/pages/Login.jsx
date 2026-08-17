import { useState } from "react";

/*
  ============================================================
  VIGIL - TEMPORARY FRONTEND AUTHENTICATION
  ============================================================

  IMPORTANT:
  - This version uses ONLY sessionStorage.
  - No localStorage is used.
  - Accounts exist only for the current browser tab/session.
  - Later this will be replaced by Flask/backend authentication.
*/


/* ============================================================
   DEMO ACCOUNT
   ============================================================ */

const DEFAULT_ACCOUNTS = [
  {
    name: "Demo Traffic Officer",
    station: "Sadar Police Station",
    userId: "VIGIL001",
    password: "vigil123",
    phone: "",
    email: "",
    address: "",
    photo: "",
  },
];


/* ============================================================
   NAGPUR CITY POLICE STATIONS
   ============================================================ */

const NAGPUR_POLICE_STATIONS = [
  "Ajani Police Station",
  "Ambazari Police Station",
  "Bajaj Nagar Police Station",
  "Beltarodi Police Station",
  "Dhantoli Police Station",
  "Ganeshpeth Police Station",
  "Gittikhadan Police Station",
  "Hingna Police Station",
  "Hudkeshwar Police Station",
  "Imamwada Police Station",
  "Jaripatka Police Station",
  "Kalamna Police Station",
  "Kapil Nagar Police Station",
  "Koradi Police Station",
  "Kotwali Police Station",
  "Lakadganj Police Station",
  "Mankapur Police Station",
  "MIDC Police Station",
  "Nandanvan Police Station",
  "Panchpaoli Police Station",
  "Pardi Police Station",
  "Pratap Nagar Police Station",
  "Sadar Police Station",
  "Sakkardara Police Station",
  "Shanti Nagar Police Station",
  "Sitabuldi Police Station",
  "Sonegaon Police Station",
  "Tahsil Police Station",
  "Wadi Police Station",
  "Wathoda Police Station",
  "Yashodhara Nagar Police Station",
];


/* ============================================================
   GET ACCOUNTS FROM SESSION STORAGE
   ============================================================ */

const getAccounts = () => {
  const savedAccounts =
    sessionStorage.getItem("vigil_accounts");

  if (!savedAccounts) {
    sessionStorage.setItem(
      "vigil_accounts",
      JSON.stringify(DEFAULT_ACCOUNTS)
    );

    return DEFAULT_ACCOUNTS;
  }

  try {
    return JSON.parse(savedAccounts);
  } catch {
    sessionStorage.setItem(
      "vigil_accounts",
      JSON.stringify(DEFAULT_ACCOUNTS)
    );

    return DEFAULT_ACCOUNTS;
  }
};


/* ============================================================
   LOGIN COMPONENT
   ============================================================ */

function Login({ onLogin }) {

  const [mode, setMode] = useState("signin");


  /* ==========================================================
     SIGN IN DATA
     ========================================================== */

  const [loginData, setLoginData] = useState({
    userId: "",
    password: "",
    station: "",
  });


  /* ==========================================================
     SIGN UP DATA
     ========================================================== */

  const [signupData, setSignupData] = useState({
    name: "",
    station: "",
    userId: "",
    password: "",
    confirmPassword: "",
    phone: "",
    email: "",
    address: "",
    photo: "",
  });


  const [error, setError] = useState("");
  const [message, setMessage] = useState("");


  /* ==========================================================
     SIGN IN
     ========================================================== */

  const handleLogin = (event) => {

    event.preventDefault();

    setError("");
    setMessage("");

    const accounts = getAccounts();

    const enteredUserId =
      loginData.userId.trim().toLowerCase();

    const account = accounts.find(
      (item) =>
        item.userId.toLowerCase() ===
          enteredUserId &&
        item.password ===
          loginData.password &&
        item.station ===
          loginData.station
    );


    if (!account) {

      setError(
        "Invalid User ID, password, or police station."
      );

      return;
    }


    /* ========================================================
       CREATE TEMPORARY SESSION
       ======================================================== */

    const session = {
      name: account.name,
      userId: account.userId,
      station: account.station,
      phone: account.phone || "",
      email: account.email || "",
      address: account.address || "",
      photo: account.photo || "",
    };


    sessionStorage.setItem(
      "vigil_session",
      JSON.stringify(session)
    );


    /* ========================================================
       SEND AUTHENTICATED OFFICER TO APP
       ======================================================== */

    onLogin(session);
  };


  /* ==========================================================
     SIGN UP
     ========================================================== */

  const handleSignup = (event) => {

    event.preventDefault();

    setError("");
    setMessage("");


    /* ========================================================
       REQUIRED FIELDS
       ======================================================== */

    if (
      !signupData.name.trim() ||
      !signupData.station ||
      !signupData.userId.trim() ||
      !signupData.password ||
      !signupData.phone.trim() ||
      !signupData.email.trim() ||
      !signupData.address.trim()
    ) {

      setError(
        "Please complete all required fields."
      );

      return;
    }


    /* ========================================================
       PASSWORD LENGTH
       ======================================================== */

    if (signupData.password.length < 6) {

      setError(
        "Password must contain at least 6 characters."
      );

      return;
    }


    /* ========================================================
       PASSWORD MATCH
       ======================================================== */

    if (
      signupData.password !==
      signupData.confirmPassword
    ) {

      setError(
        "Passwords do not match."
      );

      return;
    }


    const accounts = getAccounts();


    /* ========================================================
       USER ID CHECK
       ======================================================== */

    const userAlreadyExists =
      accounts.some(
        (account) =>
          account.userId.toLowerCase() ===
          signupData.userId
            .trim()
            .toLowerCase()
      );


    if (userAlreadyExists) {

      setError(
        "This User ID already exists."
      );

      return;
    }


    /* ========================================================
       CREATE ACCOUNT
       ======================================================== */

    const newAccount = {

      name:
        signupData.name.trim(),

      station:
        signupData.station,

      userId:
        signupData.userId.trim(),

      password:
        signupData.password,

      phone:
        signupData.phone.trim(),

      email:
        signupData.email.trim(),

      address:
        signupData.address.trim(),

      photo:
        signupData.photo || "",
    };


    const updatedAccounts = [
      ...accounts,
      newAccount,
    ];


    /* ========================================================
       STORE TEMPORARY ACCOUNT
       ======================================================== */

    sessionStorage.setItem(
      "vigil_accounts",
      JSON.stringify(updatedAccounts)
    );


    /* ========================================================
       SUCCESS MESSAGE
       ======================================================== */

    setMessage(
      "Account created successfully. You can now sign in."
    );


    /* ========================================================
       RESET SIGNUP FORM
       ======================================================== */

    setSignupData({
      name: "",
      station: "",
      userId: "",
      password: "",
      confirmPassword: "",
      phone: "",
      email: "",
      address: "",
      photo: "",
    });


    /* ========================================================
       SWITCH TO SIGN IN
       ======================================================== */

    setMode("signin");


    /* ========================================================
       PRE-FILL USER ID AND STATION
       ======================================================== */

    setLoginData({
      userId: newAccount.userId,
      password: "",
      station: newAccount.station,
    });
  };


  /* ==========================================================
     SWITCH TO SIGN IN
     ========================================================== */

  const openSignin = () => {

    setMode("signin");

    setError("");
    setMessage("");
  };


  /* ==========================================================
     SWITCH TO SIGN UP
     ========================================================== */

  const openSignup = () => {

    setMode("signup");

    setError("");
    setMessage("");
  };


  /* ==========================================================
     UI
     ========================================================== */

  return (

    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">

      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden grid lg:grid-cols-2">


        {/* ====================================================
            LEFT SIDE - VIGIL BRANDING
            ==================================================== */}

        <div className="bg-slate-900 text-white p-8 md:p-12 flex flex-col items-center justify-center text-center">


          {/* ==================================================
              LARGE CIRCULAR LOGO
              ================================================== */}

          <div className="flex items-center justify-center">

            <img
              src="/vigil-logo.png"
              alt="VIGIL Logo"
              className="
                w-56
                h-56
                md:w-64
                md:h-64
                object-contain
                rounded-full
                border-4
                border-blue-400
                bg-white
                p-3
                shadow-2xl
              "
            />

          </div>


          {/* ==================================================
              PAGE NAME
              ================================================== */}

          <h1 className="mt-7 text-5xl md:text-6xl font-extrabold tracking-wide">
            VIGIL
          </h1>


          {/* ==================================================
              SUBTITLE
              ================================================== */}

          <p className="mt-2 text-blue-300 text-sm md:text-base font-bold tracking-[0.25em]">
            NAGPUR TRAFFIC INTELLIGENCE
          </p>


          {/* ==================================================
              DIVIDER
              ================================================== */}

          <div className="w-24 h-1 bg-blue-500 rounded-full mt-7 mb-6">
          </div>


          {/* ==================================================
              VIGIL MEANING
              ================================================== */}

          <p className="max-w-md text-slate-200 text-base md:text-lg leading-relaxed font-medium">

            <span className="text-white font-bold">
              Vigilance
            </span>
            {" • "}
            <span className="text-white font-bold">
              Intelligence
            </span>
            {" • "}
            <span className="text-white font-bold">
              Guidance
            </span>
            {" • "}
            <span className="text-white font-bold">
              Incident Response
            </span>

          </p>


          {/* ==================================================
              PROJECT DESCRIPTION
              ================================================== */}

          <p className="max-w-md mt-5 text-slate-400 text-sm md:text-base leading-relaxed">

            An intelligent traffic intelligence system designed
            to help Nagpur Traffic Police identify road risks,
            analyze incidents, and make informed police
            deployment decisions.

          </p>


          {/* ==================================================
              BOTTOM LINE
              ================================================== */}

          <p className="mt-7 text-blue-300 text-sm font-semibold">

            Smarter Intelligence • Safer Roads • Faster Response

          </p>

        </div>


        {/* ====================================================
            RIGHT SIDE - AUTHENTICATION
            ==================================================== */}

        <div className="p-6 md:p-10">


          {/* ==================================================
              SIGN IN / SIGN UP TABS
              ================================================== */}

          <div className="flex border-b border-slate-200 mb-7">

            <button
              type="button"
              onClick={openSignin}
              className={`flex-1 py-3 font-semibold transition ${
                mode === "signin"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              Sign In
            </button>


            <button
              type="button"
              onClick={openSignup}
              className={`flex-1 py-3 font-semibold transition ${
                mode === "signup"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              Sign Up
            </button>

          </div>


          {/* ==================================================
              ERROR MESSAGE
              ================================================== */}

          {error && (

            <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">

              {error}

            </div>

          )}


          {/* ==================================================
              SUCCESS MESSAGE
              ================================================== */}

          {message && (

            <div className="mb-5 p-3 rounded-xl bg-green-50 border border-green-200 text-green-700 text-sm">

              {message}

            </div>

          )}


          {/* ==================================================
              SIGN IN FORM
              ================================================== */}

          {mode === "signin" ? (

            <form
              onSubmit={handleLogin}
              className="space-y-5"
            >


              {/* TITLE */}

              <div>

                <h2 className="text-2xl font-bold text-slate-900">
                  Officer Sign In
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  Access the VIGIL operational dashboard.
                </p>

              </div>


              {/* USER ID */}

              <Input
                label="User ID"
                value={loginData.userId}
                onChange={(value) =>
                  setLoginData({
                    ...loginData,
                    userId: value,
                  })
                }
                placeholder="Enter your User ID"
              />


              {/* PASSWORD */}

              <Input
                label="Password"
                type="password"
                value={loginData.password}
                onChange={(value) =>
                  setLoginData({
                    ...loginData,
                    password: value,
                  })
                }
                placeholder="Enter your password"
              />


              {/* POLICE STATION */}

              <Select
                label="Police Station"
                value={loginData.station}
                onChange={(value) =>
                  setLoginData({
                    ...loginData,
                    station: value,
                  })
                }
                options={NAGPUR_POLICE_STATIONS}
                placeholder="Select police station"
              />


              {/* SIGN IN BUTTON */}

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition"
              >
                Sign In
              </button>


              {/* DEMO CREDENTIALS */}

              <div className="text-xs text-slate-400 text-center">
                Demo: VIGIL001 / vigil123 / Sadar Police Station
              </div>

            </form>

          ) : (

            /* =================================================
               SIGN UP FORM
               ================================================= */

            <form
              onSubmit={handleSignup}
              className="space-y-4"
            >


              {/* TITLE */}

              <div>

                <h2 className="text-2xl font-bold text-slate-900">
                  Create Officer Account
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  Register your VIGIL officer account.
                </p>

              </div>


              {/* FULL NAME */}

              <Input
                label="Full Name"
                value={signupData.name}
                onChange={(value) =>
                  setSignupData({
                    ...signupData,
                    name: value,
                  })
                }
                placeholder="Enter full name"
              />


              {/* POLICE STATION */}

              <Select
                label="Police Station"
                value={signupData.station}
                onChange={(value) =>
                  setSignupData({
                    ...signupData,
                    station: value,
                  })
                }
                options={NAGPUR_POLICE_STATIONS}
                placeholder="Select police station"
              />


              {/* MOBILE NUMBER */}

              <Input
                label="Mobile Number"
                type="tel"
                value={signupData.phone}
                onChange={(value) =>
                  setSignupData({
                    ...signupData,
                    phone: value,
                  })
                }
                placeholder="Enter mobile number"
              />


              {/* EMAIL */}

              <Input
                label="Email Address"
                type="email"
                value={signupData.email}
                onChange={(value) =>
                  setSignupData({
                    ...signupData,
                    email: value,
                  })
                }
                placeholder="Enter email address"
              />


              {/* ADDRESS */}

              <div>

                <label className="block text-sm font-semibold mb-2 text-slate-700">
                  Address
                </label>

                <textarea
                  value={signupData.address}
                  onChange={(event) =>
                    setSignupData({
                      ...signupData,
                      address: event.target.value,
                    })
                  }
                  placeholder="Enter your address"
                  rows="3"
                  required
                  className="
                    w-full
                    border
                    border-slate-200
                    rounded-xl
                    px-4
                    py-3
                    outline-none
                    transition
                    resize-none
                    focus:border-blue-500
                    focus:ring-2
                    focus:ring-blue-100
                  "
                />

              </div>


              {/* USER ID */}

              <Input
                label="Create User ID"
                value={signupData.userId}
                onChange={(value) =>
                  setSignupData({
                    ...signupData,
                    userId: value,
                  })
                }
                placeholder="Create User ID"
              />


              {/* PASSWORD */}

              <Input
                label="Create Password"
                type="password"
                value={signupData.password}
                onChange={(value) =>
                  setSignupData({
                    ...signupData,
                    password: value,
                  })
                }
                placeholder="Create password"
              />


              {/* CONFIRM PASSWORD */}

              <Input
                label="Confirm Password"
                type="password"
                value={signupData.confirmPassword}
                onChange={(value) =>
                  setSignupData({
                    ...signupData,
                    confirmPassword: value,
                  })
                }
                placeholder="Confirm password"
              />


              {/* CREATE ACCOUNT */}

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition"
              >
                Create Account
              </button>

            </form>

          )}

        </div>

      </div>

    </div>
  );
}


/* ============================================================
   INPUT COMPONENT
   ============================================================ */

function Input({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}) {

  return (

    <div>

      <label className="block text-sm font-semibold mb-2 text-slate-700">
        {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        placeholder={placeholder}
        required
        className="
          w-full
          border
          border-slate-200
          rounded-xl
          px-4
          py-3
          outline-none
          transition
          focus:border-blue-500
          focus:ring-2
          focus:ring-blue-100
        "
      />

    </div>
  );
}


/* ============================================================
   SELECT COMPONENT
   ============================================================ */

function Select({
  label,
  value,
  onChange,
  options,
  placeholder,
}) {

  return (

    <div>

      <label className="block text-sm font-semibold mb-2 text-slate-700">
        {label}
      </label>

      <select
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        required
        className="
          w-full
          border
          border-slate-200
          rounded-xl
          px-4
          py-3
          outline-none
          bg-white
          transition
          focus:border-blue-500
          focus:ring-2
          focus:ring-blue-100
        "
      >

        <option value="">
          {placeholder}
        </option>

        {options.map((option) => (
          <option
            key={option}
            value={option}
          >
            {option}
          </option>
        ))}

      </select>

    </div>
  );
}


export default Login;