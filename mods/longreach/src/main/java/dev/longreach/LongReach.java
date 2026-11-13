package dev.longreach;

import net.fabricmc.api.ModInitializer;
import net.fabricmc.fabric.api.entity.event.v1.ServerPlayerEvents;
import net.fabricmc.fabric.api.networking.v1.ServerPlayConnectionEvents;
import net.fabricmc.loader.api.FabricLoader;
import net.minecraft.entity.attribute.EntityAttributeInstance;
import net.minecraft.entity.attribute.EntityAttributeModifier;
import net.minecraft.entity.attribute.EntityAttributes;
import net.minecraft.server.network.ServerPlayerEntity;
import net.minecraft.util.Identifier;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.io.Reader;
import java.io.Writer;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Properties;

/**
 * Long Reach: adds a flat bonus to the player's entity interaction range
 * (the distance at which you can hit mobs and players).
 *
 * <p>The bonus is applied server-side as a temporary attribute modifier, so the
 * vanilla server check accepts the longer hits. It is re-applied on join and
 * respawn and is never saved into the player data, so removing the mod leaves
 * no trace.
 */
public final class LongReach implements ModInitializer {
    public static final String MOD_ID = "longreach";
    public static final Logger LOG = LoggerFactory.getLogger(MOD_ID);

    private static final Identifier MODIFIER_ID = Identifier.of(MOD_ID, "attack_reach_bonus");
    private static final double DEFAULT_BONUS = 1.0;

    private double bonus = DEFAULT_BONUS;

    @Override
    public void onInitialize() {
        bonus = loadBonus(FabricLoader.getInstance().getConfigDir().resolve(MOD_ID + ".properties"));
        LOG.info("Long Reach: +{} Blöcke Angriffsreichweite", bonus);

        ServerPlayConnectionEvents.JOIN.register((handler, sender, server) -> apply(handler.getPlayer(), bonus));
        ServerPlayerEvents.AFTER_RESPAWN.register((oldPlayer, newPlayer, alive) -> apply(newPlayer, bonus));
    }

    /**
     * Sets the reach modifier on a player, replacing any previous one.
     *
     * @param player the player to modify
     * @param amount blocks added to the entity interaction range (vanilla default: 3.0)
     */
    public static void apply(ServerPlayerEntity player, double amount) {
        EntityAttributeInstance range = player.getAttributeInstance(EntityAttributes.ENTITY_INTERACTION_RANGE);
        if (range == null) {
            return;
        }
        range.removeModifier(MODIFIER_ID);
        if (amount != 0.0) {
            range.addTemporaryModifier(new EntityAttributeModifier(
                    MODIFIER_ID, amount, EntityAttributeModifier.Operation.ADD_VALUE));
        }
    }

    /** Reads the bonus from the config file, creating it with the default if missing. */
    static double loadBonus(Path file) {
        Properties props = new Properties();
        if (Files.exists(file)) {
            try (Reader r = Files.newBufferedReader(file)) {
                props.load(r);
                return Double.parseDouble(props.getProperty("bonus", String.valueOf(DEFAULT_BONUS)).trim());
            } catch (IOException | NumberFormatException e) {
                LOG.warn("Long Reach: Config {} ungültig, nutze Standard {}", file, DEFAULT_BONUS, e);
                return DEFAULT_BONUS;
            }
        }
        props.setProperty("bonus", String.valueOf(DEFAULT_BONUS));
        try {
            Files.createDirectories(file.getParent());
            try (Writer w = Files.newBufferedWriter(file)) {
                props.store(w, "Long Reach - zusaetzliche Angriffsreichweite in Bloecken (Vanilla: 3.0)");
            }
        } catch (IOException e) {
            LOG.warn("Long Reach: Konnte Config {} nicht schreiben", file, e);
        }
        return DEFAULT_BONUS;
    }
}
