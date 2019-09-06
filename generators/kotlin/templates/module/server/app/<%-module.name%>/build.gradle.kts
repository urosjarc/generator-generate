import org.jetbrains.kotlin.gradle.tasks.KotlinCompile

plugins {
    application
    id(Plug.kotlin_jvm.id)
    id(Plug.heroku.id) version Plug.heroku.version
    id(Plug.shadow.id) version Plug.shadow.version
}

application {
    mainClassName = "io.ktor.server.netty.EngineMain"
}

heroku {
    appName = rootProject.name

    includeBuildDir = false
    includes = listOf("build/libs/${project.name}-${project.version}-all.jar")

    this.processTypes = mapOf(
        "web" to "java -jar ${projectDir.relativeTo(rootDir)}/${includes.first()}"
    )
}


repositories {
    mavenLocal()
    jcenter()
    maven { url = uri(Bintray.ktor) }
}

dependencies {
    
    implementation(Libs.logback)

    for(lib in Libs.ktor)
        implementation(lib)

    for(lib in Libs.ktor_test)
        testImplementation(lib)

}

tasks.withType<KotlinCompile> {
    kotlinOptions {
        allWarningsAsErrors = false
    }
}