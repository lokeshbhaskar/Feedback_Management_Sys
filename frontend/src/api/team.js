import axiosInstance from "../utils/axiosInstance";

export const getTeamMembers = async () => {
    const res = await axiosInstance.get("/team/members")
    return res.data;
}

export const inviteTeamMember = async (name, email, role) => {
    try {
        const res = await axiosInstance.post("/team/invite",{
            name: name,
            email: email,
            role: role
        });
        return res.data;
    } catch (error) {
        throw error.response?.data;
    }
}

export const removeTeamMember =  async (memberId) => {
    try {
        const res = await axiosInstance.delete(`/team/members/${memberId}`)
        return res.data;
    } catch (error) {
        throw error.response?.data;
    }
}

export const updateTeamMemberRole = async (memberId, role) => {
    try {
        const res = await axiosInstance.patch(`/team/members/${memberId}/role`, { role })
        return res.data;
    } catch (error) {
        throw error.response?.data;
    }
}   
