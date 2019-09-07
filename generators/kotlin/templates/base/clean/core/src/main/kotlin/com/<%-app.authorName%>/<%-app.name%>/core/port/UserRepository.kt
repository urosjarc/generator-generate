package com.<%-app.authorName%>.<%-app.name%>.core.port

import com.<%-app.authorName%>.<%-app.name%>.core.port.User

interface UserRepository {

    suspend fun create(user: User): User
    suspend fun findById(id: String): User?
    suspend fun findByEmail(email: String): User?
    suspend fun findAllUsers(): List<User>

}