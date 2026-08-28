class PoliceAllocator:
    """
    VIGIL police deployment optimizer.

    The allocator receives:
        - risk zones
        - available police units
        - incident information

    and produces a recommended deployment.

    The initial implementation uses a weighted priority
    approach. It can later be replaced with a formal
    optimization algorithm without changing the API.
    """

    def __init__(self):
        self.severity_weights = {
            "low": 1,
            "medium": 2,
            "high": 3,
            "critical": 4
        }

    def _risk_weight(self, risk_level):
        """
        Convert risk level into a numerical priority.
        """

        mapping = {
            "low": 1,
            "medium": 2,
            "high": 3,
            "critical": 4
        }

        return mapping.get(
            str(risk_level).lower(),
            1
        )

    def _incident_weight(self, incidents):
        """
        Calculate additional priority caused by incidents.
        """

        if not incidents:
            return 0

        total = 0

        for incident in incidents:
            severity = str(
                incident.get(
                    "severity",
                    "medium"
                )
            ).lower()

            total += self.severity_weights.get(
                severity,
                2
            )

        return total

    def calculate_priority(self, zone):
        """
        Calculate deployment priority for a risk zone.
        """

        risk_level = zone.get(
            "risk_level",
            "low"
        )

        risk_score = zone.get(
            "risk_score",
            0
        )

        try:
            risk_score = float(
                risk_score
            )
        except (
            TypeError,
            ValueError
        ):
            risk_score = 0

        incidents = zone.get(
            "incidents",
            []
        )

        priority = (
            risk_score * 0.60
            +
            self._risk_weight(
                risk_level
            ) * 10
            +
            self._incident_weight(
                incidents
            ) * 5
        )

        return round(
            priority,
            2
        )

    def rank_zones(self, zones):
        """
        Rank zones from highest to lowest deployment priority.
        """

        ranked = []

        for zone in zones:
            zone_copy = dict(zone)

            zone_copy["priority_score"] = (
                self.calculate_priority(
                    zone
                )
            )

            ranked.append(
                zone_copy
            )

        ranked.sort(
            key=lambda item: item[
                "priority_score"
            ],
            reverse=True
        )

        return ranked

    def allocate(
        self,
        zones,
        police_units
    ):
        """
        Allocate available police units to the highest
        priority risk zones.

        Each unit is assigned to at most one zone.
        """

        if not zones:
            return {
                "allocations": [],
                "unallocated_units": police_units
            }

        if not police_units:
            return {
                "allocations": [],
                "unallocated_units": []
            }

        ranked_zones = self.rank_zones(
            zones
        )

        allocations = []

        available_units = list(
            police_units
        )

        for zone in ranked_zones:

            if not available_units:
                break

            required_units = zone.get(
                "recommended_units",
                1
            )

            try:
                required_units = int(
                    required_units
                )
            except (
                TypeError,
                ValueError
            ):
                required_units = 1

            required_units = max(
                required_units,
                1
            )

            assigned = []

            for _ in range(
                min(
                    required_units,
                    len(available_units)
                )
            ):
                unit = available_units.pop(
                    0
                )

                assigned.append(
                    unit
                )

            allocations.append({
                "zone_id": zone.get(
                    "zone_id"
                ),
                "location": zone.get(
                    "location"
                ),
                "risk_level": zone.get(
                    "risk_level",
                    "Low"
                ),
                "risk_score": zone.get(
                    "risk_score",
                    0
                ),
                "priority_score": zone.get(
                    "priority_score",
                    0
                ),
                "assigned_units": assigned,
                "units_assigned": len(
                    assigned
                )
            })

        return {
            "allocations": allocations,
            "unallocated_units": available_units
        }