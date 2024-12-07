import { Modal, Table, Button } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { FaCheck, FaTimes } from 'react-icons/fa';
import { BACKEND_URL } from '../url';

export default function DashUsers() {
    const { currentstudent } = useSelector((state) => state.student);
    const [users, setUsers] = useState([]);
    const [showMore, setShowMore] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [userIdToDelete, setUserIdToDelete] = useState('');
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await fetch(`${BACKEND_URL}/server/student/getusers`, {
                    credentials: 'include',
                } );
                const data = await res.json();
                if (res.ok) {
                    setUsers(data.users);
                    if (data.users.length < 9) {
                        setShowMore(false);
                    }
                }
            } catch (error) {
                console.log(error.message);
            }
        };
        if (currentstudent.isAdmin) {
            fetchUsers();
        }
    }, [currentstudent._id]);

    const handleShowMore = async () => {
        const startIndex = users.length;
        try {
            const res = await fetch(`${BACKEND_URL}/server/student/getusers?startIndex=${startIndex}`, {
                credentials: 'include',
            });
            const data = await res.json();
            if (res.ok) {
                setUsers((prev) => [...prev, ...data.users]);
                if (data.users.length < 9) {
                    setShowMore(false);
                }
            }
        } catch (error) {
            console.log(error.message);
        }
    };

    const handleDeleteUser = async () => {
        try {
            const res = await fetch(`${BACKEND_URL}/server/student/delete/${userIdToDelete}`, {
                method: 'DELETE',
                credentials: 'include',
            });
            const data = await res.json();
            if (res.ok) {
                setUsers((prev) => prev.filter((student) => student._id !== userIdToDelete));
                setShowModal(false);
            } else {
                console.log(data.message);
            }
        } catch (error) {
            console.log(error.message);
        }
    };

    return (
        <div className='table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>
            {currentstudent.isAdmin && users.length > 0 ? (
                <>
                    <Table hoverable className='shadow-md'>
                        <Table.Head>
                            <Table.HeadCell>Date created</Table.HeadCell>
                            <Table.HeadCell>User image</Table.HeadCell>
                            <Table.HeadCell>Username</Table.HeadCell>
                            <Table.HeadCell>Email</Table.HeadCell>
                            <Table.HeadCell>StudentId</Table.HeadCell>
                            <Table.HeadCell>Admin</Table.HeadCell>
                            <Table.HeadCell>Alumni</Table.HeadCell>
                            <Table.HeadCell>Delete</Table.HeadCell>
                        </Table.Head>
                        {users.map((student) => (
                            <Table.Body className='divide-y' key={student._id}>
                                <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                                    <Table.Cell>
                                        {new Date(student.createdAt).toLocaleDateString()}
                                    </Table.Cell>
                                    <Table.Cell>
                                        <img
                                            src={student.profilePicture}
                                            alt={student.name}
                                            className='w-10 h-10 object-cover bg-gray-500 rounded-full'
                                        />
                                    </Table.Cell>
                                    <Table.Cell>{student.name}</Table.Cell>
                                    <Table.Cell>{student.email}</Table.Cell>
                                    <Table.Cell>{student.studentID}</Table.Cell>
                                    <Table.Cell>
                                        {student.isAdmin ? (
                                            <FaCheck className='text-green-500' />
                                        ) : (
                                            <FaTimes className='text-red-500' />
                                        )}
                                    </Table.Cell>
                                    <Table.Cell>
                                        {student.isAlumni ? (
                                            <FaCheck className='text-green-500' />
                                        ) : (
                                            <FaTimes className='text-red-500' />
                                        )}
                                    </Table.Cell>
                                    <Table.Cell>
                                        <span
                                            onClick={() => {
                                                setShowModal(true);
                                                setUserIdToDelete(student._id);
                                            }}
                                            className='font-medium text-red-500 hover:underline cursor-pointer'
                                        >
                                            Delete
                                        </span>
                                    </Table.Cell>
                                </Table.Row>
                            </Table.Body>
                        ))}
                    </Table>
                    {showMore && (
                        <button
                            onClick={handleShowMore}
                            className='w-full text-teal-500 self-center text-sm py-7'
                        >
                            Show more
                        </button>
                    )}
                </>
            ) : (
                <p>You have no students yet!</p>
            )}
            <Modal
                show={showModal}
                onClose={() => setShowModal(false)}
                popup
                size='md'
            >
                <Modal.Header />
                <Modal.Body>
                    <div className='text-center'>
                        <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
                        <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>
                            Are you sure you want to delete this student?
                        </h3>
                        <div className='flex justify-center gap-4'>
                            <Button color='failure' onClick={handleDeleteUser}>
                                Yes, I'm sure
                            </Button>
                            <Button color='gray' onClick={() => setShowModal(false)}>
                                No, cancel
                            </Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    );
}