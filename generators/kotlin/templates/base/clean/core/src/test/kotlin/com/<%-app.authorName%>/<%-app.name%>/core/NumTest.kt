package com.<%-app.authorName%>.<%-app.name%>.core

import org.junit.jupiter.api.Test

import org.junit.jupiter.api.Assertions.*

internal class NumTest {

    val num = Num()

    @Test
    fun getNumber() {
        assertEquals(24, num.getNumber())
    }
}