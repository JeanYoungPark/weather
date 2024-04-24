import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { View, StyleSheet, Text, ScrollView, Dimensions, ActivityIndicator } from "react-native";
import * as Location from "expo-location";
import { Fontisto } from "@expo/vector-icons";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const icons = {
    Clouds: "cloudy",
    Clear: "day-sunny",
    Atmosphere: "cloudy-gusts",
    Snow: "snow",
    Rain: "rain",
    Drizzle: "",
    Thunderstorm: "lightning",
};

export default function App() {
    const [city, setCity] = useState("Loading...");
    const [days, setDays] = useState([]);
    const [ok, setOk] = useState(true);

    const getWeather = async () => {
        const { granted } = await Location.requestForegroundPermissionsAsync();

        if (!granted) {
            setOk(false);
        }

        const {
            coords: { latitude, longitude },
        } = await Location.getCurrentPositionAsync({ accuracy: 5 });
        const location = await Location.reverseGeocodeAsync({ latitude, longitude }, { useGoogleMaps: false });
        setCity(location[0].region);

        const res = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`);
        const json = await res.json();

        json?.list && setDays(json.list);
    };

    useEffect(() => {
        getWeather();
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.city}>
                <Text style={styles.cityName}>{city}</Text>
            </View>
            <ScrollView pagingEnabled horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.weather}>
                {days?.length === 0 ? (
                    <View style={styles.day}>
                        <ActivityIndicator color='white' size='large' />
                    </View>
                ) : (
                    days.map((day, idx) => (
                        <View style={styles.day}>
                            <View style={styles.tempWrap}>
                                <Text style={styles.temp}>{parseFloat(day.main.temp).toFixed(1)}</Text>
                                <Fontisto name={icons[day.weather[0].main]} style={styles.icon} />
                            </View>
                            <Text style={styles.desc}>{day.weather[0].main}</Text>
                            <Text style={styles.tinyText}>{day.weather[0].description}</Text>
                            <Text style={styles.date}>{day.dt_txt}</Text>
                        </View>
                    ))
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "tomato",
    },
    city: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    cityName: {
        fontSize: 48,
        fontWeight: "500",
        color: "white",
    },
    weather: {},
    day: {
        width: SCREEN_WIDTH,
        alignItems: "center",
    },
    tempWrap: {
        flexDirection: "row",
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
    },
    icon: {
        marginTop: 40,
        marginLeft: 10,
        fontSize: 40,
        color: "white",
    },
    temp: {
        color: "white",
        marginTop: 30,
        fontSize: 100,
    },
    desc: {
        color: "white",
        marginTop: -30,
        fontSize: 50,
    },
    tinyText: {
        color: "white",
        fontSize: 20,
    },
    date: {
        marginTop: 10,
        fontSize: 20,
        color: "white",
    },
});
