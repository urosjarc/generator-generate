package com.<%-app.authorName%>.<%-app.name%>.<%-module.name%>

import com.<%-app.authorName%>.<%-app.name%>.<%-module.name%>.adapters.retNum2
import org.junit.jupiter.api.Test

import org.junit.jupiter.api.Assertions.*

internal class MainTest {

    @Test
    fun `ret Num 3`() {
        assertEquals(24, retNum2())
    }
}