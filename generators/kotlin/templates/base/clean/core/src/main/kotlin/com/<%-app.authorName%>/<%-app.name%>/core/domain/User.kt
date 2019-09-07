package com.<%-app.authorName%>.<%-app.name%>.core.domain

data class User(
    var id: String = "",
    var email: String,
    var password: String,
    val lastName: String,
    val firstName: String
)