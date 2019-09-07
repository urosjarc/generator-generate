package com.<%-app.authorName%>.<%-app.name%>.core.usecase

import com.<%-app.authorName%>.<%-app.name%>.core.domain.User
import com.<%-app.authorName%>.<%-app.name%>.core.usecase.exception.NotAllowedException
import com.<%-app.authorName%>.<%-app.name%>.core.port.PasswordEncoder
import com.<%-app.authorName%>.<%-app.name%>.core.port.UserRepository

class LoginUser(private val userRepository: UserRepository,
                private val passwordEncoder: PasswordEncoder){

    suspend fun login(email: String, password: String): User {
        val user = userRepository.findByEmail(email) ?: throw NotAllowedException("Login is not allowed")

        val hashedPassword = passwordEncoder.encode(password)

        if(user.password != hashedPassword){
            throw NotAllowedException("User email/password not matching")
        }

        return user
    }
}