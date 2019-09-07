package com.<%-app.authorName%>.<%-app.name%>.core.usecase

import com.<%-app.authorName%>.<%-app.name%>.core.domain.User
import com.<%-app.authorName%>.<%-app.name%>.core.usecase.exception.UserAlreadyExistsException
import com.<%-app.authorName%>.<%-app.name%>.core.port.IdGenerator
import com.<%-app.authorName%>.<%-app.name%>.core.port.PasswordEncoder
import com.<%-app.authorName%>.<%-app.name%>.core.port.UserRepository
import com.<%-app.authorName%>.<%-app.name%>.core.usecase.validator.UserValidator

class CreateUser(
    private val userRepository: UserRepository,
    private val passwordEncoder: PasswordEncoder,
    private val idGenerator: IdGenerator
) {

    suspend fun create(user: User): User {
        UserValidator.validateCreatedUser(user)

        if(userRepository.findByEmail(user.email) != null)
            throw UserAlreadyExistsException(user.email)

        user.id = idGenerator.generate()
        user.password = passwordEncoder.encode(user.password)

        return userRepository.create(user)
    }
}