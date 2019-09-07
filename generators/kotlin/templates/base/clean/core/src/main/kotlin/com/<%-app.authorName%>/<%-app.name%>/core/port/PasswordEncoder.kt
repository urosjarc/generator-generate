package com.<%-app.authorName%>.<%-app.name%>.core.port

interface PasswordEncoder {
    fun encode(password: String): String
}