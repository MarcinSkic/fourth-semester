from math import radians, cos, sin, asin, sqrt


class Geopoint:

    def __init__ (self,lat,lon):
        self.lat = lat
        self.lon = lon

    def __eq__ (self,o):
        return o.lat == self.lat and o.lon == self.lon

    def __str__ (self):
        return f'lat: {self.lat}, lon: {self.lon}'

    def __repr__(self):
        return f'{self.lat} {self.lon}'

    def __lt__(self,o):
        return Geopoint.haversine(self.lon,self.lat) < Geopoint.haversine(o.lon,o.lat) 

    @staticmethod
    def haversine(lon1, lat1):

        lat2 = 51.21167
        lon2 = 22.52222
        # convert decimal degrees to radians
        lon1, lat1, lon2, lat2 = map(radians, [lon1, lat1, lon2,
        lat2])
        # haversine formula
        dlon = lon2 - lon1
        dlat = lat2 - lat1
        a = sin(dlat / 2)**2 + cos(lat1) * cos(lat2) * sin(dlon /
        2)**2
        c = 2 * asin(sqrt(a))
        # Radius of earth in kilometers is 6371
        meters = 6371000 * c
        return meters

x = Geopoint(51.21782,22.54583)
y = Geopoint(51.21353,22.54142)
z = Geopoint(51.21483,22.52527)
ż = Geopoint(51.22352,22.55640)

print("Dystans: " + str(Geopoint.haversine(x.lon, x.lat)))

print(x > y)

lista = [x,y,z,ż]
print(lista)
lista.sort()
print(lista)