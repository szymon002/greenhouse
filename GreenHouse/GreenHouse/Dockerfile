FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS base
WORKDIR /app
EXPOSE 80

FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /src
COPY ["GreenHouse.csproj", "./"]
RUN dotnet restore "GreenHouse.csproj"
COPY . .
WORKDIR "/src/"
RUN dotnet build "GreenHouse.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "GreenHouse.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "GreenHouse.dll"]