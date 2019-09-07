package com.<%-app.authorName%>.<%-app.name%>.core.usecase

import com.<%-app.authorName%>.<%-app.name%>.core.domain.User
import com.<%-app.authorName%>.<%-app.name%>.core.port.UserRepository
import org.koin.core.KoinComponent

class FindUser(
    private val userRepository: UserRepository): KoinComponent {

    suspend fun findById(id: String): User? {
        return userRepository.findById(id)
    }

    suspend fun findAllUsers(): List<User> {
        return userRepository.findAllUsers()
    }

}