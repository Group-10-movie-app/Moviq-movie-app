import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export default function GroupsView() {
    const [groups, setGroups] = useState([]);
    const [newGroupName, setNewGroupName] = useState('');
    const [showCreateForm, setShowCreateForm] = useState(false);
    const { user, token } = useAuth();
    const navigate = useNavigate();

    const fetchGroups = useCallback(async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/groups`);
            setGroups(response.data.groups);
        } catch (error) {
            console.error('Error fetching groups:', error);
            toast.error('Failed to fetch groups');
        }
    }, []);

    useEffect(() => {
        fetchGroups();
    }, [fetchGroups]);

    useEffect(() => {
        fetchGroups();
    }, [fetchGroups]);


    const handleCreateGroup = async (e) => {
        e.preventDefault();
        if (!user) {
            toast.error('Please sign in to create a group');
            return;
        }

        try {
            await axios.post(
                `${API_BASE_URL}/groups/create`,
                { group_name: newGroupName },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success('Group created successfully');
            setNewGroupName('');
            setShowCreateForm(false);
            fetchGroups();
        } catch (error) {
            toast.error('Failed to create group');
        }
    };

    return (
        <div className="container mt-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 style={{ color: '#FFD700' }}>Groups</h1>
                {user && (
                    <button
                        className="btn btn-primary"
                        onClick={() => setShowCreateForm(!showCreateForm)}
                    >
                        {showCreateForm ? 'Cancel' : 'Create New Group'}
                    </button>
                )}
            </div>

            {showCreateForm && (
                <form onSubmit={handleCreateGroup} className="mb-4">
                    <div className="input-group">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Enter group name"
                            value={newGroupName}
                            onChange={(e) => setNewGroupName(e.target.value)}
                            required
                        />
                        <button type="submit" className="btn btn-primary">
                            Create
                        </button>
                    </div>
                </form>
            )}

            <div className="row">
                {groups.map((group) => (
                    <div key={group.group_id} className="col-md-4 mb-4">
                        <div className="card" style={{ backgroundColor: '#2A2A2A' }}>
                            <div className="card-body">
                                <h5 className="card-title" style={{ color: '#FFD700' }}>{group.group_name}</h5>
                                <p className="card-text text-white">
                                    Owner: {group.first_name} {group.last_name}
                                    <br />
                                    Members: {group.member_count}
                                </p>
                                <div className="d-flex flex-column gap-2">
                                    {user && (
                                        user.user_id === group.owner_id || group.is_member ? (
                                            <button
                                                className="btn btn-primary w-100"
                                                onClick={() => navigate(`/groups/${group.group_id}`)}
                                            >
                                                View Group
                                            </button>
                                        ) : (
                                            <button
                                                className="btn w-100"
                                                style={{ backgroundColor: '#FF7560', color: 'white' }}
                                                onClick={() => navigate(`/groups/${group.group_id}`)}
                                            >
                                                View Group
                                            </button>
                                        )
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
