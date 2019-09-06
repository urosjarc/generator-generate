package com.<%-app.authorName%>.<%-app.name%>.<%-module.name%>

import org.junit.jupiter.api.Test
import org.junit.jupiter.api.Assertions.*
import com.<%-app.authorName%>.<%-app.name%>.<%-module.name%>.Num

internal class Num2Test {
    @Test
    fun `ret Num 2`() {
        val num = Num()
        assertEquals(24, num.getNumber())
    }
}