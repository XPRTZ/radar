Back in 1965 [Tony Hoare](https://en.wikipedia.org/wiki/Tony_Hoare) introduced the null reference in [ALGOL W](https://en.wikipedia.org/wiki/ALGOL_W) and this was copied by a lot of languages. Later he called this his billion-dollar mistake and apologized for the problem this has caused.
C# was one of the languages that copied this feature and its developers and users had to suffer for it. Starting with C#8.0 developers now have the option to get rid of this pain with [Nullable reference types](https://docs.microsoft.com/en-us/dotnet/csharp/nullable-references). Does this mean that null doesn't exist anymore? No but you have to be explicit about it.
Reference types now behave like value types for example (bool, int, char, etc.)
When you want to create a nullable string now you have to define it as follows:
```C#
string? name;
```
Then when ever you use this variable in your code with first checking for a null you will get a compiler warning;
To be able to intoduce this concept gradually in your code this feature can be enabled per project or per class see also [Upgrade to nullable references](https://docs.microsoft.com/en-us/dotnet/csharp/whats-new/tutorials/upgrade-to-nullable-references).
We see this feature as a way to better declare the intent of our code and a good practice to prevent the dreaded Null Reference Exception.