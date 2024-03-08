"use client";
import Image from "next/image";
import axios from "axios";
import { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import PacmanLoader from "react-spinners/PacmanLoader";
import { ClipLoader } from "react-spinners";
export default function Home() {
  const [tables, setTables] = useState();
  const [checkedRows, setCheckRows] = useState([]);
  const [tableObj, setTableObj] = useState({});
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isUpdatePopupOpen, setIsUpdatePopupOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emailSending, setEmailSending] = useState(false);
  const formSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    phone: Yup.string()
      .min(10, "Phone number should be at least 10 digits")
      .matches(/^[0-9]+$/, "Phone number must be only digits")
      .required("Phone number is required"),
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    hobbies: Yup.string().required("Hobbies are required"),
  });

  const onHandleChange = async (e) => {
    const { name, value } = e.target;
    setTableObj({ ...tableObj, [name]: value });
    console.log(tableObj);
  };

  const onSave = async (values) => {
    try {
      const res = await axios.post(
        "https://dingus-redpositive-fullstack-app.onrender.com/newTable",
        {
          ...values,
          hobbies: values.hobbies.split(" "),
        }
      );
      console.log(values);
      setTables([...tables, res.data]);
      setIsPopupOpen(false);
      setIsUpdatePopupOpen(false);
      setTableObj({});
    } catch (error) {
      alert(error.message);
    }
  };

  const onUpdate = async (table) => {
    try {
      console.log("her");
      setTableObj(table);
      setIsUpdatePopupOpen(true);
    } catch (error) {
      console.log(error.message);
    }
  };

  const onUpdateBtnClick = async (values) => {
    try {
      console.log(values);
      const res = await axios.patch(
        "https://dingus-redpositive-fullstack-app.onrender.com/updateTable",
        {
          ids: [tableObj._id],
          ...values,
          hobbies: values.hobbies.split(" "),
        }
      );
      console.log(res.data);
      setTables(res.data);
      setIsPopupOpen(false);
      setIsUpdatePopupOpen(false);
      setTableObj({});
    } catch (error) {}
  };

  const getTables = async () => {
    setLoading(true);
    fetch(`https://dingus-redpositive-fullstack-app.onrender.com/getAllTables`)
      .then((response) => response.json())
      .then((data) => {
        setTables(data);
        setLoading(false);
      });
  };

  const deleteTable = async (id) => {
    setTables(tables.filter((table) => table._id !== id));

    try {
      const res = await axios.delete(
        "https://dingus-redpositive-fullstack-app.onrender.com/deleteTable",
        {
          data: { ids: [id] },
        }
      );
    } catch (error) {
      alert(error.message);
    }
  };

  const handleSelected = async (id) => {
    if (checkedRows.includes(id)) {
      setCheckRows(checkedRows.filter((row) => row !== id));
    } else {
      setCheckRows([...checkedRows, id]);
    }
  };

  const handleSend = async () => {
    try {
      if (checkedRows.length == 0) {
        alert("Please Select Some Rows");
      }
      setEmailSending(true);
      setLoading(true);
      const res = await axios
        .post("https://dingus-redpositive-fullstack-app.onrender.com/getCSV", {
          ids: checkedRows,
        })
        .then(() =>
          alert(
            "Email has been Sent to info@redpositive.in ! \n Please check your email inbox!"
          )
        );
      setEmailSending(false);
      setLoading(false);
      setCheckRows([]);
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    getTables();
  }, []);

  console.log(checkedRows);
  return (
    <>
      <>
        {/* Form for adding new entries */}
        <nav class="bg-blue-500 p-4 text-white">
          <div class="container mx-auto flex justify-between items-center">
            <a href="#" class="text-lg font-semibold">
              Full Stack App
            </a>
          </div>
        </nav>
        {(isPopupOpen || isUpdatePopupOpen) && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full"
            id="my-modal"
          >
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <Formik
                initialValues={
                  isUpdatePopupOpen
                    ? {
                        _id: tableObj._id,
                        name: tableObj.name,
                        phone: tableObj.phone,
                        email: tableObj.email,
                        hobbies: tableObj.hobbies.toString(),
                      }
                    : { name: "", phone: "", email: "", hobbies: "" }
                }
                validationSchema={formSchema}
                onSubmit={(values, { setSubmitting }) => {
                  if (isPopupOpen) {
                    onSave(values);
                  } else if (isUpdatePopupOpen) {
                    onUpdateBtnClick(values);
                  }
                  setSubmitting(false);
                  setIsPopupOpen(false);
                  setIsUpdatePopupOpen(false);
                }}
              >
                {({ isSubmitting }) => (
                  <Form>
                    <div className="mb-6">
                      <label
                        className="block text-gray-700 text-sm font-bold mb-2"
                        htmlFor="name"
                      >
                        Name
                      </label>
                      <Field
                        name="name"
                        type="text"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      />
                      <ErrorMessage
                        name="name"
                        component="div"
                        className="text-red-500 text-xs italic"
                      />
                    </div>

                    <div className="mb-6">
                      <label
                        className="block text-gray-700 text-sm font-bold mb-2"
                        htmlFor="phone"
                      >
                        Phone Number
                      </label>
                      <Field
                        name="phone"
                        type="text"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      />
                      <ErrorMessage
                        name="phone"
                        component="div"
                        className="text-red-500 text-xs italic"
                      />
                    </div>

                    <div className="mb-6">
                      <label
                        className="block text-gray-700 text-sm font-bold mb-2"
                        htmlFor="email"
                      >
                        Email
                      </label>
                      <Field
                        name="email"
                        type="email"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      />
                      <ErrorMessage
                        name="email"
                        component="div"
                        className="text-red-500 text-xs italic"
                      />
                    </div>

                    <div className="mb-6">
                      <label
                        className="block text-gray-700 text-sm font-bold mb-2"
                        htmlFor="hobbies"
                      >
                        Hobbies
                      </label>
                      <Field
                        name="hobbies"
                        type="text"
                        placeholder="Seperate hobbies by a comma or space"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      />
                      <ErrorMessage
                        name="hobbies"
                        component="div"
                        className="text-red-500 text-xs italic"
                      />
                    </div>

                    <div className="inline-flex items-center justify-center gap-4">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                      >
                        {isUpdatePopupOpen ? "Update" : "Save"}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setTableObj({});
                          setIsPopupOpen(false);
                          setIsUpdatePopupOpen(false);
                        }}
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                      >
                        Cancel
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        )}
        {/* Table for displaying entries */}
        <div className="flex flex-col  mt-8 mb-8 ">
          <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
              {emailSending ? (
                <div className="flex flex-cols justify-center text-4xl mb-7">
                  Sending email ...
                </div>
              ) : null}

              {!loading ? (
                <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        {" "}
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Select
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          ID
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Name
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Phone Number
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Email
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Hobbies
                        </th>
                        <th
                          scope="col"
                          class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Actions
                        </th>
                      </tr>
                    </thead>

                    {tables?.map((table) => (
                      <>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {/* Dynamic rows go here */}
                          <tr>
                            <td className="px-10 py-4 whitespace-nowrap checkbox">
                              <input
                                type="checkbox"
                                checked={checkedRows.includes(table._id)}
                                onChange={() => handleSelected(table._id)}
                                class="bg-gray-200 border-gray-300 text-indigo-500 focus:ring-indigo-200"
                              />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {table._id}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {table.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {table.phone}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {table.email}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {table?.hobbies?.join(",")}
                            </td>
                            <td class="inline-flex py-4 whitespace-nowrap text-right text-sm font-medium">
                              <a
                                className="text-indigo-600 hover:text-indigo-900"
                                onClick={() => onUpdate(table)}
                              >
                                Update
                              </a>
                              <a
                                className="text-red-600 hover:text-red-900 ml-4"
                                onClick={() => deleteTable(table._id)}
                              >
                                Delete
                              </a>
                            </td>
                          </tr>
                          {/* More dynamic rows as needed */}
                        </tbody>
                      </>
                    ))}
                  </table>
                </div>
              ) : (
                <div className="flex flex-cols justify-center">
                  <PacmanLoader size={50} color="#36d7b7" />
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-10 justify-center">
          {" "}
          <div></div>
          <button
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            onClick={() => setIsPopupOpen(true)}
          >
            Add New Data
          </button>
          <button
            onClick={() => handleSend()}
            className=" bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="button"
          >
            Send
          </button>
          <div></div>
        </div>
      </>
    </>
  );
}
