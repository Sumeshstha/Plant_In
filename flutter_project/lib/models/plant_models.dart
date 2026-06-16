import 'dart:convert';

class JournalEntry {
  final String id;
  final String date;
  final String category; // 'general', 'watering', 'repotting', 'fertilizing', 'new-growth', 'pest-treatment'
  final String title;
  final String notes;
  final String? imageUrl;
  final double? plantHeight;

  JournalEntry({
    required this.id,
    required this.date,
    required this.category,
    required this.title,
    required this.notes,
    this.imageUrl,
    this.plantHeight,
  });

  Map<String, dynamic> toJson() => {
        'id': id,
        'date': date,
        'category': category,
        'title': title,
        'notes': notes,
        if (imageUrl != null) 'imageUrl': imageUrl,
        if (plantHeight != null) 'plantHeight': plantHeight,
      };

  factory JournalEntry.fromJson(Map<String, dynamic> json) => JournalEntry(
        id: json['id'] as String,
        date: json['date'] as String,
        category: json['category'] as String,
        title: json['title'] as String,
        notes: json['notes'] as String,
        imageUrl: json['imageUrl'] as String?,
        plantHeight: json['plantHeight'] != null
            ? (json['plantHeight'] as num).toDouble()
            : null,
      );
}

class Plant {
  final String id;
  final String name;
  final String scientificName;
  final String image;
  final String description;
  final int vitality;
  final String healthStatus; // 'Healthy', 'Needs Attention', 'Excellent'
  final String light;
  final String watering;
  final String temp;
  final String habitat; // 'Indoor', 'Outdoor'
  final List<String> tags;
  final String? spaceId;
  final List<JournalEntry> journals;
  final String? lastWateredDate; // YYYY-MM-DD
  final int wateringIntervalDays;
  final String? lastFertilizedDate; // YYYY-MM-DD
  final int fertilizerIntervalDays;
  final String? lastRepottedDate; // YYYY-MM-DD
  final int repotIntervalMonths;

  Plant({
    required this.id,
    required this.name,
    required this.scientificName,
    required this.image,
    required this.description,
    required this.vitality,
    required this.healthStatus,
    required this.light,
    required this.watering,
    required this.temp,
    required this.habitat,
    required this.tags,
    this.spaceId,
    required this.journals,
    this.lastWateredDate,
    required this.wateringIntervalDays,
    this.lastFertilizedDate,
    required this.fertilizerIntervalDays,
    this.lastRepottedDate,
    required this.repotIntervalMonths,
  });

  Plant copyWith({
    String? id,
    String? name,
    String? scientificName,
    String? image,
    String? description,
    int? vitality,
    String? healthStatus,
    String? light,
    String? watering,
    String? temp,
    String? habitat,
    List<String>? tags,
    String? spaceId,
    List<JournalEntry>? journals,
    String? lastWateredDate,
    int? wateringIntervalDays,
    String? lastFertilizedDate,
    int? fertilizerIntervalDays,
    String? lastRepottedDate,
    int? repotIntervalMonths,
  }) {
    return Plant(
      id: id ?? this.id,
      name: name ?? this.name,
      scientificName: scientificName ?? this.scientificName,
      image: image ?? this.image,
      description: description ?? this.description,
      vitality: vitality ?? this.vitality,
      healthStatus: healthStatus ?? this.healthStatus,
      light: light ?? this.light,
      watering: watering ?? this.watering,
      temp: temp ?? this.temp,
      habitat: habitat ?? this.habitat,
      tags: tags ?? this.tags,
      spaceId: spaceId ?? this.spaceId,
      journals: journals ?? this.journals,
      lastWateredDate: lastWateredDate ?? this.lastWateredDate,
      wateringIntervalDays: wateringIntervalDays ?? this.wateringIntervalDays,
      lastFertilizedDate: lastFertilizedDate ?? this.lastFertilizedDate,
      fertilizerIntervalDays: fertilizerIntervalDays ?? this.fertilizerIntervalDays,
      lastRepottedDate: lastRepottedDate ?? this.lastRepottedDate,
      repotIntervalMonths: repotIntervalMonths ?? this.repotIntervalMonths,
    );
  }

  Map<String, dynamic> toJson() => {
        'id': id,
        'name': name,
        'scientificName': scientificName,
        'image': image,
        'description': description,
        'vitality': vitality,
        'healthStatus': healthStatus,
        'light': light,
        'watering': watering,
        'temp': temp,
        'habitat': habitat,
        'tags': tags,
        'spaceId': spaceId,
        'journals': journals.map((e) => e.toJson()).toList(),
        'lastWateredDate': lastWateredDate,
        'wateringIntervalDays': wateringIntervalDays,
        'lastFertilizedDate': lastFertilizedDate,
        'fertilizerIntervalDays': fertilizerIntervalDays,
        'lastRepottedDate': lastRepottedDate,
        'repotIntervalMonths': repotIntervalMonths,
      };

  factory Plant.fromJson(Map<String, dynamic> json) => Plant(
        id: json['id'] as String,
        name: json['name'] as String,
        scientificName: json['scientificName'] as String,
        image: json['image'] as String,
        description: json['description'] as String,
        vitality: json['vitality'] as int,
        healthStatus: json['healthStatus'] as String,
        light: json['light'] as String,
        watering: json['watering'] as String,
        temp: json['temp'] as String,
        habitat: json['habitat'] as String,
        tags: List<String>.from(json['tags'] ?? []),
        spaceId: json['spaceId'] as String?,
        journals: (json['journals'] as List<dynamic>?)
                ?.map((e) => JournalEntry.fromJson(e as Map<String, dynamic>))
                .toList() ??
            [],
        lastWateredDate: json['lastWateredDate'] as String?,
        wateringIntervalDays: json['wateringIntervalDays'] as int? ?? 7,
        lastFertilizedDate: json['lastFertilizedDate'] as String?,
        fertilizerIntervalDays: json['fertilizerIntervalDays'] as int? ?? 14,
        lastRepottedDate: json['lastRepottedDate'] as String?,
        repotIntervalMonths: json['repotIntervalMonths'] as int? ?? 12,
      );
}

class Task {
  final String id;
  final String type; // 'water', 'mist', 'feed'
  final String title;
  final String subtitle;
  final bool completed;

  Task({
    required this.id,
    required this.type,
    required this.title,
    required this.subtitle,
    required this.completed,
  });

  Task copyWith({bool? completed}) => Task(
        id: id,
        type: type,
        title: title,
        subtitle: subtitle,
        completed: completed ?? this.completed,
      );

  Map<String, dynamic> toJson() => {
        'id': id,
        'type': type,
        'title': title,
        'subtitle': subtitle,
        'completed': completed,
      };

  factory Task.fromJson(Map<String, dynamic> json) => Task(
        id: json['id'] as String,
        type: json['type'] as String,
        title: json['title'] as String,
        subtitle: json['subtitle'] as String,
        completed: json['completed'] as bool,
      );
}

class Space {
  final String id;
  final String name;
  final int plantCount;
  final String status; // 'Lush', 'Stable', 'Dry Soil'
  final String image;
  final String? alert;

  Space({
    required this.id,
    required this.name,
    required this.plantCount,
    required this.status,
    required this.image,
    this.alert,
  });

  Map<String, dynamic> toJson() => {
        'id': id,
        'name': name,
        'plantCount': plantCount,
        'status': status,
        'image': image,
        if (alert != null) 'alert': alert,
      };

  factory Space.fromJson(Map<String, dynamic> json) => Space(
        id: json['id'] as String,
        name: json['name'] as String,
        plantCount: json['plantCount'] as int,
        status: json['status'] as String,
        image: json['image'] as String,
        alert: json['alert'] as String?,
      );
}

class Tip {
  final String id;
  final String title;
  final String content;
  final String icon;
  final String color;

  Tip({
    required this.id,
    required this.title,
    required this.content,
    required this.icon,
    required this.color,
  });

  Map<String, dynamic> toJson() => {
        'id': id,
        'title': title,
        'content': content,
        'icon': icon,
        'color': color,
      };

  factory Tip.fromJson(Map<String, dynamic> json) => Tip(
        id: json['id'] as String,
        title: json['title'] as String,
        content: json['content'] as String,
        icon: json['icon'] as String,
        color: json['color'] as String,
      );
}
