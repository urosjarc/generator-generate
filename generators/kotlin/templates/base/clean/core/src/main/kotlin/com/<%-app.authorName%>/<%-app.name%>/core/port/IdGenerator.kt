package com.<%-app.authorName%>.<%-app.name%>.core.port

interface IdGenerator {
    fun generate(): String
}