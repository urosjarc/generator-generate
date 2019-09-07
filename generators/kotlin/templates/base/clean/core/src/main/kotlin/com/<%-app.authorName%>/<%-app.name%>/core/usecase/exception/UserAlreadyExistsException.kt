package com.<%-app.authorName%>.<%-app.name%>.core.usecase.exception

class UserAlreadyExistsException(email: String) : RuntimeException(email)
